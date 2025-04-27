import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import database from "./conexion.js";
import usuarioRoutes from '../usuariosRoutes/usuariosRoutes.js';

const PORT = process.env.PORT ?? 3000;

//CREACION DEL SERVIDOR
const app = express();
const server = createServer(app);
const io = new Server(server);

//MOSTRAR EN CONSOLA LAS PETICIONES
app.use(logger("dev")); 

//SERVIR ARCHIVOS ESTATICOS
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Rutas del usuario
app.use('/api/usuarios', usuarioRoutes);

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
  
  
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
