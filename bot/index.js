const venom = require('venom-bot');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Inicializar Google Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

// Función para cargar configuración
function cargarConfiguracion() {
  const archivo = path.join(__dirname, '..', 'data', 'configuracion.json');
  try {
    if (fs.existsSync(archivo)) {
      return JSON.parse(fs.readFileSync(archivo, 'utf8'));
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
  }
  return {};
}

// Función para guardar historial
function guardarHistorial(usuario, mensaje, respuesta) {
  const fs = require('fs');
  const path = require('path');
  const archivo = path.join(__dirname, '..', 'data', 'historial', `${usuario}.json`);

  try {
    let historial = [];
    if (fs.existsSync(archivo)) {
      historial = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    }

    historial.push({
      timestamp: new Date().toISOString(),
      mensaje: mensaje,
      respuesta: respuesta
    });

    fs.writeFileSync(archivo, JSON.stringify(historial, null, 2));
  } catch (error) {
    console.error('Error al guardar historial:', error);
  }
}

// Función para actualizar usuarios
function actualizarUsuario(usuario) {
  const fs = require('fs');
  const path = require('path');
  const archivo = path.join(__dirname, '..', 'data', 'usuarios.json');

  try {
    let usuarios = {};
    if (fs.existsSync(archivo)) {
      usuarios = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    }

    if (!usuarios[usuario]) {
      usuarios[usuario] = {
        categoria: 'Nuevo',
        ultimoMensaje: new Date().toISOString(),
        totalMensajes: 0
      };
    }

    usuarios[usuario].ultimoMensaje = new Date().toISOString();
    usuarios[usuario].totalMensajes = (usuarios[usuario].totalMensajes || 0) + 1;

    fs.writeFileSync(archivo, JSON.stringify(usuarios, null, 2));
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
}

// Función para verificar respuestas personalizadas
function obtenerRespuestaPersonalizada(mensaje) {
  const fs = require('fs');
  const path = require('path');
  const archivo = path.join(__dirname, '..', 'data', 'respuestas_personalizadas.json');

  try {
    if (fs.existsSync(archivo)) {
      const respuestas = JSON.parse(fs.readFileSync(archivo, 'utf8'));
      const mensajeLower = mensaje.toLowerCase();

      for (const [categoria, config] of Object.entries(respuestas)) {
        if (config.palabras_clave.some(palabra => mensajeLower.includes(palabra))) {
          return config.respuesta;
        }
      }
    }
  } catch (error) {
    console.error('Error leyendo respuestas personalizadas:', error);
  }

  return null;
}

// Función para guardar mensaje entrante
function guardarMensajeEntrante(usuario, mensaje) {
  const fs = require('fs');
  const path = require('path');
  const archivo = path.join(__dirname, '..', 'data', 'mensajes_entrantes.json');

  try {
    let mensajes = [];
    if (fs.existsSync(archivo)) {
      mensajes = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    }

    mensajes.unshift({
      id: Date.now(),
      usuario: usuario,
      mensaje: mensaje,
      timestamp: new Date().toISOString(),
      respondido: false
    });

    // Mantener solo los últimos 100 mensajes
    if (mensajes.length > 100) {
      mensajes = mensajes.slice(0, 100);
    }

    fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
  } catch (error) {
    console.error('Error guardando mensaje entrante:', error);
  }
}

// Función para obtener respuesta de Google Gemini
async function obtenerRespuestaIA(mensaje) {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: 'Eres un asistente útil para un bot de WhatsApp. Responde de manera amigable y concisa en español.'
    });

    const result = await model.generateContent(mensaje);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Error con Google Gemini:', error);

    // Respuestas locales como fallback
    const respuestasLocales = {
      'hola': '¡Hola! 👋 ¿En qué puedo ayudarte?',
      'gracias': '¡De nada! 😊 ¿Necesitas algo más?',
      'precio': 'Para información de precios, por favor contacta a nuestro equipo.',
      'horario': 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.',
      'ayuda': 'Estoy aquí para ayudarte. ¿Qué necesitas saber?'
    };

    // Buscar respuesta aproximada
    const mensajeLower = mensaje.toLowerCase();
    for (const [palabra, respuesta] of Object.entries(respuestasLocales)) {
      if (mensajeLower.includes(palabra)) {
        return respuesta;
      }
    }

    return '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?';
  }
}

const config = cargarConfiguracion();

console.log('🤖 Iniciando Bot de WhatsApp con IA...');
console.log(`📱 Número configurado: ${config.numero_telefono || 'No configurado'}`);
console.log(`👤 Nombre del bot: ${config.nombre_bot || 'Asistente IA'}`);
console.log(`🌍 Idioma: ${config.idioma || 'es'}`);
console.log(`🚀 Estado: ${config.activo ? 'Activo' : 'Inactivo'}`);

if (!config.numero_telefono) {
  console.log('⚠️  ADVERTENCIA: No hay número de teléfono configurado.');
  console.log('📝 Ve al panel web -> Configuración para configurar el número.');
  process.exit(1);
}

if (!config.activo) {
  console.log('⚠️  El bot está configurado como inactivo.');
  console.log('📝 Actívalo en el panel web -> Configuración.');
  process.exit(1);
}

venom
  .create({
    session: `whatsapp-ia-bot-${config.numero_telefono.replace(/\D/g, '')}`,
    multidevice: true,
    headless: false, // Mostrar navegador para ver QR
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  })
  .then((client) => {
    console.log(`✅ Bot de WhatsApp con IA iniciado para ${config.nombre_bot}`);
    console.log(`📞 Conectado al número: ${config.numero_telefono}`);

    client.onMessage(async (message) => {
      if (message.isGroupMsg === false && message.from !== 'status@broadcast') {
        try {
          const usuario = message.from.replace('@c.us', '');
          const mensajeUsuario = message.body;

          console.log(`📨 NUEVO MENSAJE - Usuario: ${usuario}, Mensaje: "${mensajeUsuario}"`);

          // Guardar mensaje entrante
          guardarMensajeEntrante(usuario, mensajeUsuario);

          // Actualizar datos del usuario
          actualizarUsuario(usuario);

          // Verificar si hay respuesta personalizada
          let respuesta = obtenerRespuestaPersonalizada(mensajeUsuario);
          console.log(`🔍 Respuesta personalizada: ${respuesta ? 'ENCONTRADA' : 'NO ENCONTRADA'}`);

          // Si no hay respuesta personalizada, usar IA
          if (!respuesta) {
            console.log('🤖 Consultando IA (Google Gemini)...');
            respuesta = await obtenerRespuestaIA(mensajeUsuario);
            console.log(`💭 Respuesta de IA: "${respuesta.substring(0, 50)}..."`);
          } else {
            console.log(`⚡ Usando respuesta personalizada: "${respuesta}"`);
          }

          // Enviar respuesta
          console.log(`📤 Enviando respuesta a ${usuario}...`);
          await client.sendText(message.from, respuesta);
          console.log(`✅ Respuesta enviada exitosamente a ${usuario}`);

          // Guardar en historial
          guardarHistorial(usuario, mensajeUsuario, respuesta);

        } catch (error) {
          console.error('❌ Error procesando mensaje:', error);
          console.error('Detalles del error:', error.message);
        }
      }
    });

    // El bot ya está listo cuando llega aquí
    console.log('🎉 ¡Bot de WhatsApp completamente listo y conectado!');
    console.log('📞 Número conectado:', config.numero_telefono);
    console.log('👤 Nombre del bot:', config.nombre_bot);
    console.log('🚀 Esperando mensajes...');
  })
  .catch((error) => {
    console.error('Error al iniciar el bot:', error);
  });