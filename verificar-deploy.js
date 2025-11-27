#!/usr/bin/env node

/**
 * Script de verificación para despliegue en la nube
 * Verifica que todas las configuraciones necesarias estén presentes
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para despliegue...\n');

let errores = [];
let advertencias = [];

// Verificar archivos esenciales
const archivosEsenciales = [
  'package.json',
  'panel/app.js',
  'bot/index.js',
  'bot-simulado.js',
  'data/configuracion.json',
  'data/respuestas_personalizadas.json'
];

console.log('📁 Verificando archivos esenciales...');
archivosEsenciales.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    console.log(`✅ ${archivo}`);
  } else {
    errores.push(`❌ Falta archivo: ${archivo}`);
  }
});

// Verificar directorios
const directoriosEsenciales = [
  'panel/views',
  'panel/public',
  'data'
];

console.log('\n📂 Verificando directorios...');
directoriosEsenciales.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    errores.push(`❌ Falta directorio: ${dir}/`);
  }
});

// Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  if (!packageJson.scripts || !packageJson.scripts.start) {
    errores.push('❌ Falta script "start" en package.json');
  } else {
    console.log('✅ Script "start" configurado');
  }

  if (!packageJson.dependencies.express) {
    errores.push('❌ Falta dependencia Express');
  } else {
    console.log('✅ Express instalado');
  }

  if (!packageJson.dependencies['@google/generative-ai']) {
    errores.push('❌ Falta dependencia Google Gemini');
  } else {
    console.log('✅ Google Gemini instalado');
  }
} catch (error) {
  errores.push('❌ Error leyendo package.json');
}

// Verificar variables de entorno
console.log('\n🔐 Verificando variables de entorno...');
if (fs.existsSync('.env.example')) {
  console.log('✅ Archivo .env.example presente');
} else {
  advertencias.push('⚠️  No se encontró .env.example');
}

const envVars = ['GEMINI_API_KEY', 'OPENAI_API_KEY'];
envVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`✅ ${varName} configurada`);
  } else {
    advertencias.push(`⚠️  ${varName} no configurada (se configurará en la nube)`);
  }
});

// Verificar archivos de despliegue
console.log('\n🚀 Verificando archivos de despliegue...');
const archivosDespliegue = ['Dockerfile', 'render.yaml', 'railway.json'];
archivosDespliegue.forEach(archivo => {
  if (fs.existsSync(archivo)) {
    console.log(`✅ ${archivo} presente`);
  } else {
    advertencias.push(`⚠️  ${archivo} no encontrado (opcional)`);
  }
});

// Verificar configuración del bot
console.log('\n🤖 Verificando configuración del bot...');
try {
  const configPath = path.join('data', 'configuracion.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    console.log('✅ Configuración del bot presente');

    if (config.numero_telefono) {
      console.log(`📱 Número configurado: ${config.numero_telefono}`);
    } else {
      advertencias.push('⚠️  Número de teléfono no configurado');
    }
  } else {
    errores.push('❌ Falta archivo de configuración del bot');
  }
} catch (error) {
  errores.push('❌ Error leyendo configuración del bot');
}

// Verificar respuestas personalizadas
console.log('\n💬 Verificando respuestas personalizadas...');
try {
  const respuestasPath = path.join('data', 'respuestas_personalizadas.json');
  if (fs.existsSync(respuestasPath)) {
    const respuestas = JSON.parse(fs.readFileSync(respuestasPath, 'utf8'));
    const numRespuestas = Object.keys(respuestas).length;
    console.log(`✅ ${numRespuestas} respuestas personalizadas configuradas`);
  } else {
    errores.push('❌ Falta archivo de respuestas personalizadas');
  }
} catch (error) {
  errores.push('❌ Error leyendo respuestas personalizadas');
}

// Resultado final
console.log('\n' + '='.repeat(60));
console.log('📊 RESULTADO DE LA VERIFICACIÓN');
console.log('='.repeat(60));

if (errores.length === 0) {
  console.log('✅ ¡TODO LISTO PARA DESPLIEGUE!');
  console.log('');
  console.log('🎉 El proyecto está completamente configurado para la nube.');
  console.log('🚀 Puedes proceder con el despliegue en Railway, Render o cualquier servicio.');
} else {
  console.log('❌ ERRORES ENCONTRADOS:');
  errores.forEach(error => console.log(`   ${error}`));
  console.log('');
  console.log('🔧 Corrige estos errores antes de desplegar.');
}

if (advertencias.length > 0) {
  console.log('');
  console.log('⚠️  ADVERTENCIAS:');
  advertencias.forEach(adv => console.log(`   ${adv}`));
}

console.log('');
console.log('💡 Próximos pasos:');
console.log('1. Sube este proyecto a GitHub');
console.log('2. Conéctalo a Railway, Render o tu servicio de nube preferido');
console.log('3. Configura las variables de entorno (GEMINI_API_KEY)');
console.log('4. ¡Disfruta de tu bot de WhatsApp en la nube!');

console.log('\n' + '='.repeat(60));