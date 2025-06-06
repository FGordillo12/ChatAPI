//Importaciones de express, cookie-parser, cors y las rutas
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { routerUsuarios } from "./server/routes/usuariosRoutes.js";
import { routerPagina } from "./server/routes/paginaRoutes.js";
import { routerGraficos } from "./server/routes/graficosRoutes.js";

export const app = express(); //Se crea una instancia de express

const corsOptions = { //Importacion de cors para permitir peticiones desde el frontend
  origin: 'http://localhost:5173', //Frontend URL
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // Permitir cookies y credenciales
};

app.use(cookieParser()); // Middleware para parsear cookies en las solicitudes
app.use(express.json()); // Middleware para parsear JSON
app.use(cors(corsOptions)); // Middleware para habilitar CORS con opciones definidas

// Rutas importadas y asignadas a la aplicación
app.use('/api/', routerUsuarios); // Ruta para usuarios
app.use('/api/', routerPagina); // Ruta para páginas
app.use('/api/', routerGraficos); // Ruta para gráficos

export default app; // Exporta la aplicación para ser utilizada en otros módulos
