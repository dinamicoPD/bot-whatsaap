const fs = require('fs');
const path = require('path');

// Simulador de bot que funciona sin WhatsApp real
class BotSimulado {
  constructor() {
    this.activo = false;
    this.mensajesProcesados = 0;
    console.log('🤖 Bot Simulado de WhatsApp iniciado');
    console.log('📱 Modo simulación - Sin conexión real a WhatsApp');
    console.log('✅ Funcionando completamente en el panel web');
  }

  // Función para procesar mensajes simulados
  async procesarMensajeSimulado(mensaje, usuario = 'UsuarioDemo') {
    console.log(`📨 Procesando mensaje simulado: "${mensaje}" de ${usuario}`);

    // Guardar mensaje entrante
    this.guardarMensajeEntrante(usuario, mensaje);

    // Actualizar usuario
    this.actualizarUsuario(usuario);

    // Buscar respuesta personalizada
    let respuesta = this.obtenerRespuestaPersonalizada(mensaje);

    if (!respuesta) {
      // Usar respuestas locales como fallback
      respuesta = this.obtenerRespuestaLocal(mensaje);
      console.log('⚡ Usando respuesta local');
    } else {
      console.log('🎯 Respuesta personalizada encontrada');
    }

    // Simular envío de respuesta
    console.log(`✅ Respuesta simulada enviada: "${respuesta}"`);

    // Guardar en historial
    this.guardarHistorial(usuario, mensaje, respuesta);

    this.mensajesProcesados++;
    return respuesta;
  }

  // Obtener respuesta personalizada
  obtenerRespuestaPersonalizada(mensaje) {
    try {
      const archivo = path.join(__dirname, 'data', 'respuestas_personalizadas.json');
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

  // Respuestas locales como fallback
  obtenerRespuestaLocal(mensaje) {
    const respuestas = {
      'hola': '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte?',
      'gracias': '¡De nada! 😊 ¿Necesitas algo más?',
      'precio': 'Para información de precios, por favor contacta a nuestro equipo.',
      'horario': 'Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00.',
      'ayuda': 'Estoy aquí para ayudarte. ¿Qué necesitas saber?',
      'adiós': '¡Hasta luego! Que tengas un excelente día. 👋',
      'chau': '¡Hasta luego! Que tengas un excelente día. 👋'
    };

    const mensajeLower = mensaje.toLowerCase();
    for (const [palabra, respuesta] of Object.entries(respuestas)) {
      if (mensajeLower.includes(palabra)) {
        return respuesta;
      }
    }

    return '¡Hola! Soy un asistente virtual. ¿En qué puedo ayudarte?';
  }

  // Guardar mensaje entrante
  guardarMensajeEntrante(usuario, mensaje) {
    try {
      const archivo = path.join(__dirname, 'data', 'mensajes_entrantes.json');
      let mensajes = [];
      if (fs.existsSync(archivo)) {
        mensajes = JSON.parse(fs.readFileSync(archivo, 'utf8'));
      }

      mensajes.unshift({
        id: Date.now(),
        usuario: usuario,
        mensaje: mensaje,
        timestamp: new Date().toISOString(),
        respondido: true // En simulación, siempre respondemos
      });

      // Mantener solo los últimos 100 mensajes
      if (mensajes.length > 100) {
        mensajes = mensajes.slice(0, 100);
      }

      fs.writeFileSync(archivo, JSON.stringify(mensajes, null, 2));
    } catch (error) {
      console.error('Error guardando mensaje simulado:', error);
    }
  }

  // Actualizar datos del usuario
  actualizarUsuario(usuario) {
    try {
      const archivo = path.join(__dirname, 'data', 'usuarios.json');
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
      console.error('Error actualizando usuario simulado:', error);
    }
  }

  // Guardar historial
  guardarHistorial(usuario, mensaje, respuesta) {
    try {
      const archivo = path.join(__dirname, 'data', 'historial', `${usuario}.json`);
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
      console.error('Error guardando historial simulado:', error);
    }
  }

  // Iniciar simulación continua
  iniciarSimulacionAutomatica() {
    console.log('🎭 Iniciando simulación automática de mensajes...');

    const mensajesEjemplo = [
      'Hola, ¿cómo estás?',
      '¿Cuál es el precio?',
      'Gracias por la información',
      '¿Horarios de atención?',
      'Necesito ayuda',
      '¿Qué servicios ofrecen?',
      'Hasta luego',
      'Buen día'
    ];

    const usuariosEjemplo = [
      'Juan Pérez', 'María García', 'Carlos López', 'Ana Rodríguez',
      'Pedro Sánchez', 'Laura Martínez', 'Miguel Torres', 'Sofia Ramírez'
    ];

    // Simular mensaje cada 15-30 segundos
    setInterval(() => {
      const mensaje = mensajesEjemplo[Math.floor(Math.random() * mensajesEjemplo.length)];
      const usuario = usuariosEjemplo[Math.floor(Math.random() * usuariosEjemplo.length)];

      this.procesarMensajeSimulado(mensaje, usuario);
    }, Math.random() * 15000 + 15000); // 15-30 segundos

    console.log('✅ Simulación automática iniciada');
    console.log('📊 Los mensajes aparecerán automáticamente en el panel');
  }

  // Obtener estadísticas
  obtenerEstadisticas() {
    return {
      mensajesProcesados: this.mensajesProcesados,
      activo: this.activo,
      modo: 'simulación'
    };
  }
}

// Función para probar el bot simulado
async function probarBotSimulado() {
  const bot = new BotSimulado();

  console.log('\n🧪 Probando bot simulado...\n');

  // Probar algunos mensajes
  const mensajesPrueba = [
    'Hola',
    '¿Precio por favor?',
    'Gracias',
    '¿Horarios?',
    'Adiós'
  ];

  for (const mensaje of mensajesPrueba) {
    console.log(`\n📤 Probando: "${mensaje}"`);
    const respuesta = await bot.procesarMensajeSimulado(mensaje);
    console.log(`📥 Respuesta: "${respuesta}"`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
  }

  console.log('\n✅ Pruebas completadas');
  console.log('🎯 El bot simulado funciona correctamente');
  console.log('🌐 Ve al panel web para ver los mensajes procesados');

  // Iniciar simulación automática
  bot.iniciarSimulacionAutomatica();
}

// Si se ejecuta directamente
if (require.main === module) {
  probarBotSimulado();
}

module.exports = BotSimulado;