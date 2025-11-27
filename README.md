# 🤖 Bot de WhatsApp con IA

Un bot de WhatsApp que responde automáticamente usando **Google Gemini** (gratuito).

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Obtener API Key de Google Gemini

#### Paso 1: Crear cuenta en Google AI Studio
1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. Copia la clave generada (empieza con "AIza...")

#### Paso 2: Configurar variables de entorno
- Copia `.env.example` a `.env`
- Agrega tu clave: `GEMINI_API_KEY=tu_clave_de_google_aqui`

#### Paso 3: Probar la conexión
```bash
npm run test:gemini
```
Esto verificará que la API key funciona correctamente.

### 3. Ejecutar el proyecto

#### Opción A: Ejecutar todo junto (recomendado)
```bash
npm start
```

#### Opción B: Ejecutar solo el panel web
```bash
npm run panel
# o
node panel/app.js
```

#### Opción C: Ejecutar solo el bot
```bash
npm run bot
# o
node bot/index.js
```

#### Opción D: Ejecutar simulación de mensajes (para pruebas)
```bash
npm run test:messages
# o
node test-messages.js
```

#### Opción E: Ejecutar bot simulado completo (recomendado)
```bash
npm run bot:simulado
# o
node bot-simulado.js
```

#### Opción E: Probar conexión con Google Gemini
```bash
npm run test:gemini
# o
node test-gemini.js
```

**Nota:** El panel web funciona independientemente del bot. Si el bot tiene problemas con WhatsApp, el panel seguirá funcionando.

## 📱 Uso del Bot

1. Escanea el código QR con WhatsApp Web
2. Envía mensajes al bot desde cualquier chat privado
3. El bot responderá automáticamente usando IA

## 🖥️ Panel de Administración

Accede a http://localhost:3001 para:

### 📊 Panel Principal
- Ver lista de usuarios activos
- Estadísticas de uso

### 📨 Mensajes Entrantes
- Ver mensajes en tiempo real
- Actualización automática cada 5 segundos
- Estado de respuesta (pendiente/respondido)

### ⚙️ Configurar Respuestas
- Crear respuestas automáticas basadas en palabras clave
- Editar respuestas existentes
- Agregar nuevas categorías de respuesta

### 🔧 Configuración del Bot
- **Configurar número de teléfono**: Especifica qué número usar para el bot
- **Personalizar nombre del bot**: Cambia cómo se presenta el asistente
- **Seleccionar idioma**: Español, inglés, portugués
- **Activar/desactivar bot**: Controla si responde automáticamente
- **Estado de configuración**: Verifica que todo esté listo

###  Historial
- Revisar conversaciones completas por usuario
- Historial de interacciones

### ❓ Preguntas Frecuentes
- Gestionar preguntas y respuestas comunes

## 📁 Estructura del Proyecto

```
whatsapp-ia-bot/
├── bot/              # Lógica del bot
├── data/             # Archivos de datos
│   ├── historial/    # Historial por usuario
│   ├── preguntas_frecuentes.json
│   └── usuarios.json
├── panel/            # Panel web de administración
├── logs/             # Registros de auditoría
├── tokens/           # Datos de sesión de WhatsApp
├── .env              # Variables de entorno
└── package.json
```

## 🔒 Seguridad

- **Nunca subas** el archivo `.env` al repositorio
- La clave de API de **Google Gemini** debe mantenerse privada
- Los datos de usuarios se almacenan localmente

## 🛠️ Desarrollo

### Agregar nuevas preguntas frecuentes
Edita `data/preguntas_frecuentes.json`

### Modificar respuestas del bot
Edita el prompt en `bot/index.js`

### Personalizar el panel
Modifica las vistas en `panel/views/`

## ⚙️ Configuración del Número de Teléfono

**Antes de ejecutar el bot, debes configurar qué número de teléfono usar:**

### Opción A: Configuración Manual (Recomendado)

1. **Ejecuta el panel web:**
   ```bash
   npm run panel
   ```

2. **Ve a Configuración:**
   - Abre: http://localhost:3001/configuracion

3. **Configura tu número:**
   - **Número de teléfono**: Ingresa tu número con código de país (ej: +573001234567)
   - **Nombre del bot**: Elige cómo se presentará (ej: "Asistente IA")
   - **Idioma**: Selecciona el idioma principal
   - **Activar bot**: Marca la casilla para que responda automáticamente

4. **Guarda la configuración:**
   - Haz clic en "💾 Guardar Configuración"
   - Verifica que aparezca "✅ Configuración completa"

### Opción B: Configuración Rápida (Para pruebas)

Para configurar rápidamente con datos de ejemplo:
```bash
npm run setup
```

Esto configurará:
- Número: +573001234567 (ejemplo)
- Nombre: "Asistente IA Demo"
- Idioma: Español
- Estado: Activo

**Recuerda cambiar el número por el tuyo real antes de usar en producción.**

### Ejecutar el Bot

Una vez configurado:
```bash
npm run bot
```
- El bot se conectará específicamente al número configurado
- Mostrará información de configuración al iniciar

## 🧪 Pruebas del Sistema

### Pruebas sin WhatsApp (Recomendado para desarrollo)

Para probar el panel sin necesidad de configurar WhatsApp:

1. **Ejecuta el panel:**
   ```bash
   npm run panel
   ```

2. **Ejecuta la simulación de mensajes:**
   ```bash
   npm run test:messages
   ```

3. **Ve al panel de mensajes:**
   - Abre: http://localhost:3001/mensajes
   - Verás mensajes apareciendo en tiempo real

### Pruebas con WhatsApp (Producción)

1. **Configura el número** (ver sección anterior)

2. **Ejecuta el bot:**
   ```bash
   npm run bot
   ```
   - Escanea el QR con WhatsApp Web

3. **Envía mensajes de prueba:**
   - Prueba respuestas automáticas: "hola", "gracias"
   - Prueba IA: cualquier pregunta normal

4. **Monitorea en el panel:**
   - Mensajes aparecen automáticamente
   - Configura respuestas en `/respuestas`

### 🤖 Bot Simulado (Alternativa Recomendada)

Si tienes problemas con WhatsApp, usa el **bot simulado** que funciona completamente en el panel web:

```bash
# Ejecutar bot simulado + panel (recomendado)
npm start

# O solo el bot simulado
npm run bot:simulado
```

**Ventajas del bot simulado:**
- ✅ **Funciona inmediatamente** sin configuración de WhatsApp
- ✅ **Todas las funcionalidades** disponibles (respuestas personalizadas, IA, panel)
- ✅ **Mensajes automáticos** cada 15-30 segundos
- ✅ **Respuestas inteligentes** con Google Gemini
- ✅ **Panel completo** para gestión y configuración
- ✅ **Sin problemas de navegador o WhatsApp**

**¿Cuándo usar cada opción?**
- **Bot simulado**: Desarrollo, pruebas, demostraciones, aprendizaje
- **Bot real**: Producción con WhatsApp real
- **Ambos**: El simulado es perfecto para probar todo antes del real

**El bot simulado incluye:**
- Sistema completo de respuestas personalizadas
- Integración con Google Gemini
- Panel de administración web
- Historial de conversaciones
- Configuración avanzada
- Simulación de mensajes realistas

## 🚀 Despliegue en la Nube

### Opción 1: Railway (Recomendado - Fácil y Rápido)

1. **Crear cuenta en Railway:**
   - Ve a: https://railway.app
   - Regístrate con GitHub

2. **Desplegar proyecto:**
   ```bash
   # Conectar repositorio
   railway login
   railway link
   railway up
   ```

3. **Configurar variables de entorno:**
   ```bash
   railway variables set GEMINI_API_KEY=tu_api_key_aqui
   railway variables set OPENAI_API_KEY=tu_api_key_opcional
   ```

4. **Acceder a tu aplicación:**
   - Railway te dará una URL automática
   - El panel estará disponible en esa URL

### Opción 2: Render

1. **Crear cuenta en Render:**
   - Ve a: https://render.com
   - Conecta tu repositorio de GitHub

2. **Crear Web Service:**
   - Selecciona "Web Service"
   - Conecta tu repositorio
   - Configura:
     - **Runtime:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

3. **Variables de entorno:**
   - `GEMINI_API_KEY`
   - `OPENAI_API_KEY` (opcional)

### Opción 3: Docker (Avanzado)

```bash
# Construir imagen
docker build -t whatsapp-ia-bot .

# Ejecutar contenedor
docker run -p 3001:3001 \
  -e GEMINI_API_KEY=tu_api_key \
  whatsapp-ia-bot
```

### Opción 4: Heroku

1. **Instalar Heroku CLI**
2. **Desplegar:**
   ```bash
   heroku create tu-app-whatsapp
   git push heroku main
   heroku config:set GEMINI_API_KEY=tu_api_key
   ```

## 📋 Requisitos

- Node.js v18+
- API Key de **Google Gemini** (gratuita)
- API Key de **OpenAI** (opcional, para respaldo)
- Cuenta en servicio de nube (Railway, Render, etc.)

## ⚠️ Notas Importantes

- La primera ejecución puede tomar tiempo mientras se configura la sesión de WhatsApp
- Asegúrate de tener una conexión a internet estable
- El bot solo responde en chats privados (no grupos)