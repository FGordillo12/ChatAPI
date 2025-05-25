import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import connectiondDb from './conexion.js'
import usuarioRoutes from '../usuariosRoutes/usuariosRoutes.js';
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser";

const PORT = process.env.PORT ?? 5000;

//CREACION DEL SERVIDOR
export const app = express();
const server = createServer(app);
const io = new Server(server);

//MOSTRAR EN CONSOLA LAS PETICIONES
app.use(logger("dev")); 
app.use(cors());

//Rutas del usuario
app.use('/api/', usuarioRoutes);

//ESTABLECER CONEXION CON WEBSOCKET
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });

  socket.on("chat message", (msg) => {
    console.log("mensaje: " + msg);
  });
});

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("registro");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/main", (req, res) => {
    res.render("main");
});
  
  
const startServer = async () => {
  try {
    await connectiondDb(); 
    if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  }
  } catch (error) {
    console.error('Error al iniciar el servidor o conectar a la base de datos:', error);
    process.exit(1); 
  }
};

startServer();