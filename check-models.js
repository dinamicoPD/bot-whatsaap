const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.log('❌ No se encontró GEMINI_API_KEY');
    console.log('📝 Agrega tu clave en el archivo .env');
    return;
  }

  console.log('🔍 Verificando modelos disponibles en Google Gemini...');
  console.log('🔑 API Key:', apiKey.substring(0, 10) + '...');

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Intentar listar modelos disponibles
    console.log('\n📋 Probando diferentes modelos...');

    const modelsToTest = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-pro-vision'
    ];

    for (const modelName of modelsToTest) {
      try {
        console.log(`\n🧪 Probando modelo: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent('Hola, solo una prueba');
        const response = await result.response;
        const text = response.text();

        console.log('✅ Modelo funciona!');
        console.log('💬 Respuesta:', text.substring(0, 50) + '...');

        // Si funciona, usar este modelo
        console.log(`\n🎯 MODELO RECOMENDADO: ${modelName}`);
        console.log('📝 Actualiza tu código para usar este modelo.');

        return modelName;

      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message}`);
      }
    }

    console.log('\n❌ Ningún modelo funcionó');
    console.log('💡 Posibles causas:');
    console.log('   - API key inválida');
    console.log('   - Cuenta sin acceso a Gemini');
    console.log('   - Problemas de red');

  } catch (error) {
    console.log('❌ Error general:', error.message);
  }
}

checkAvailableModels();