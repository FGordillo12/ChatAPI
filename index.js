import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import connectiondDb from './server/database/conexion.js'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from "cookie-parser";
import { routerUsuarios } from "./server/routes/usuariosRoutes.js";
import { routerPagina } from "./server/routes/paginaRoutes.js";
const PORT = process.env.PORT;
const corsOptions = {
      origin: 'http://localhost:5173',
      allowedHeaders: 'Content-Type,Authorization',
      credentials: true
};


//CREACION DEL SERVIDOR
export const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});



//Rutas del usuario
app.use('/api/', routerUsuarios);

app.use('/api/', routerPagina);

//ESTABLECER CONEXION CON WEBSOCKET
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado");

  socket.on("chat message", ({ mensaje, nombre, rol }) => {
    const msg = { mensaje, nombre, rol };
    io.emit("chat message", msg); // envía a todos
  });

  socket.on("disconnect", () => {
    console.log("Un usuario se ha desconectado");
  });
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