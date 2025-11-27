/**
 * WhatsApp Business API Integration
 * Versión oficial y escalable para producción
 */

const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

class WhatsAppBusinessAPI {
  constructor() {
    this.app = express();
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    this.apiVersion = 'v18.0';

    if (!this.accessToken || !this.phoneNumberId || !this.verifyToken) {
      console.warn('⚠️  WhatsApp Business API no configurado completamente');
      console.warn('Configure: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_VERIFY_TOKEN');
    }
  }

  // Verificación de webhook (requerido por WhatsApp)
  verifyWebhook(req, res) {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === this.verifyToken) {
        console.log('✅ Webhook verificado correctamente');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  // Procesar mensajes entrantes
  async processIncomingMessage(message) {
    try {
      const { from, text, type } = message;

      if (type === 'text' && text && text.body) {
        const mensajeUsuario = text.body;
        const numeroUsuario = from;

        console.log(`📨 Mensaje de WhatsApp: ${numeroUsuario} - ${mensajeUsuario}`);

        // Guardar mensaje entrante
        this.saveIncomingMessage(numeroUsuario, mensajeUsuario);

        // Procesar respuesta
        const respuesta = await this.generateResponse(mensajeUsuario, numeroUsuario);

        // Enviar respuesta
        await this.sendMessage(numeroUsuario, respuesta);

        return { success: true, response: respuesta };
      }
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      return { success: false, error: error.message };
    }
  }

  // Generar respuesta inteligente
  async generateResponse(message, userNumber) {
    // Verificar respuestas personalizadas primero
    const customResponse = this.getCustomResponse(message);
    if (customResponse) {
      return customResponse;
    }

    // Usar Google Gemini para respuestas inteligentes
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `Eres un asistente de WhatsApp útil y amigable. Responde de manera concisa y natural al siguiente mensaje: "${message}"`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();

      return response.trim();
    } catch (error) {
      console.error('Error con Gemini:', error);
      return 'Lo siento, estoy teniendo problemas técnicos. ¿Puedes intentar de nuevo?';
    }
  }

  // Obtener respuesta personalizada
  getCustomResponse(message) {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'data', 'respuestas_personalizadas.json');

      if (fs.existsSync(filePath)) {
        const responses = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const messageLower = message.toLowerCase();

        for (const [category, config] of Object.entries(responses)) {
          if (config.palabras_clave.some(keyword => messageLower.includes(keyword))) {
            return config.respuesta;
          }
        }
      }
    } catch (error) {
      console.error('Error leyendo respuestas personalizadas:', error);
    }
    return null;
  }

  // Enviar mensaje via WhatsApp Business API
  async sendMessage(to, message) {
    try {
      const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

      const data = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message }
      };

      const response = await axios.post(url, data, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Mensaje enviado a ${to}`);
      return response.data;
    } catch (error) {
      console.error('Error enviando mensaje:', error.response?.data || error.message);
      throw error;
    }
  }

  // Guardar mensaje entrante
  saveIncomingMessage(from, message) {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'data', 'mensajes_entrantes.json');

      let messages = [];
      if (fs.existsSync(filePath)) {
        messages = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      }

      messages.unshift({
        id: Date.now(),
        usuario: from,
        mensaje: message,
        timestamp: new Date().toISOString(),
        respondido: false,
        plataforma: 'whatsapp_business_api'
      });

      // Mantener solo los últimos 100 mensajes
      if (messages.length > 100) {
        messages = messages.slice(0, 100);
      }

      fs.writeFileSync(filePath, JSON.stringify(messages, null, 2));
    } catch (error) {
      console.error('Error guardando mensaje:', error);
    }
  }

  // Configurar rutas del webhook
  setupRoutes() {
    // Verificación del webhook
    this.app.get('/webhook/whatsapp', (req, res) => {
      this.verifyWebhook(req, res);
    });

    // Recepción de mensajes
    this.app.post('/webhook/whatsapp', express.json(), (req, res) => {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
          entry.changes.forEach(change => {
            if (change.value && change.value.messages) {
              change.value.messages.forEach(message => {
                this.processIncomingMessage(message);
              });
            }
          });
        });

        res.status(200).send('EVENT_RECEIVED');
      } else {
        res.sendStatus(404);
      }
    });

    // Endpoint para enviar mensajes manualmente (desde panel)
    this.app.post('/api/whatsapp/send', express.json(), async (req, res) => {
      try {
        const { to, message } = req.body;
        const result = await this.sendMessage(to, message);
        res.json({ success: true, result });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    return this.app;
  }

  // Iniciar servidor
  startServer(port = 3002) {
    this.setupRoutes();

    this.app.listen(port, () => {
      console.log(`🚀 WhatsApp Business API escuchando en puerto ${port}`);
      console.log(`📱 Webhook URL: https://tu-dominio.com/webhook/whatsapp`);
      console.log(`🔧 Configura esta URL en tu proveedor de WhatsApp Business API`);
    });
  }
}

module.exports = WhatsAppBusinessAPI;

// Si se ejecuta directamente
if (require.main === module) {
  const whatsappAPI = new WhatsAppBusinessAPI();
  whatsappAPI.startServer();
}