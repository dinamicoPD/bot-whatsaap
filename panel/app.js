// panel/app.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const open = require("open");

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de vistas y archivos estáticos
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Headers de seguridad para permitir CDNs
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' https://code.jquery.com https://cdn.jsdelivr.net; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:;");
  next();
});

// Ruta principal - Página de bienvenida
app.get("/", (req, res) => {
  const archivoUsuarios = path.join(__dirname, "..", "data", "usuarios.json");
  const usuarios = fs.existsSync(archivoUsuarios) ? JSON.parse(fs.readFileSync(archivoUsuarios, 'utf8')) : {};
  res.render("index", { usuarios });
});

// Ruta para ver historial de usuarios
app.get("/historial", (req, res) => {
  const dir = path.join(__dirname, "..", "data", "historial");
  let datos = [];
  try {
    if (fs.existsSync(dir)) {
      const archivos = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
      datos = archivos.map(archivo => {
        const contenido = JSON.parse(fs.readFileSync(path.join(dir, archivo)));
        return { usuario: archivo.replace(".json", ""), interacciones: contenido };
      });
    }
  } catch (error) {
    console.error('Error leyendo historial:', error);
  }
  res.render("historial", { datos });
});

// Ruta para ver preguntas frecuentes
app.get("/preguntas", (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "preguntas_frecuentes.json");
  const preguntas = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo)) : [];
  res.render("preguntas", { preguntas });
});

// Ruta para ver mensajes entrantes
app.get("/mensajes", (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "mensajes_entrantes.json");
  const mensajes = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo)) : [];
  res.render("mensajes", { mensajes });
});

// API para obtener mensajes entrantes (para AJAX/polling)
app.get("/api/mensajes", (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "mensajes_entrantes.json");
  const mensajes = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo)) : [];
  res.json(mensajes);
});

// Ruta para configurar respuestas personalizadas
app.get("/respuestas", (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "respuestas_personalizadas.json");
  const respuestas = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo)) : {};
  res.render("respuestas", { respuestas });
});

// API para guardar respuestas personalizadas
app.post("/api/respuestas", express.json(), (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "respuestas_personalizadas.json");
  try {
    fs.writeFileSync(archivo, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta para configurar el bot
app.get("/configuracion", (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "configuracion.json");
  const config = fs.existsSync(archivo) ? JSON.parse(fs.readFileSync(archivo, 'utf8')) : {};
  res.render("configuracion", { config });
});

// API para guardar configuración del bot
app.post("/api/configuracion", express.json(), (req, res) => {
  const archivo = path.join(__dirname, "..", "data", "configuracion.json");
  try {
    fs.writeFileSync(archivo, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Panel disponible en http://localhost:${PORT}`);
  console.log(`🌐 Abre tu navegador en: http://localhost:${PORT}`);
  // open() puede fallar en algunos entornos, por eso mostramos la URL
});