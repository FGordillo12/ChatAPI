import { Server } from "socket.io";
import Mensaje from "../models/mensajes.js" // Ajusta la ruta según tu estructura

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT'],
      credentials: true,
    },
  });

  const usuarios = new Map(); // nombre => { socketId, conectado }

  function emitirListaUsuarios() {
    const usuariosFiltrados = Array.from(usuarios.entries())
      .filter(([usuarioId, info]) => info.conectado && info.type === 'Usuario')
      .map(([usuarioId, info]) => ({
        id: usuarioId,
        conectado: info.conectado,
      }));

    io.emit("usuarios conectados", usuariosFiltrados);
    console.log(usuariosFiltrados);
  }

  io.on("connection", (socket) => {
    socket.on("identify", ({ usuarioId, type }) => {
      socket.data = { usuarioId, type };
      usuarios.set(usuarioId, { socketId: socket.id, conectado: true, type });
      console.log(`Identificado: ${usuarioId} (${type})`);
      emitirListaUsuarios();
    });

    socket.on("new chat", async (mensajeObj) => {
      const msg = {
        ...mensajeObj,
        timestamp: new Date(),
        id: Date.now().toString(),
      };

      try {
        // Guardar en MongoDB
        const mensajeGuardado = new Mensaje(msg);
        await mensajeGuardado.save();
        console.log("Mensaje guardado en DB:", mensajeGuardado);

        // Emitir a destinatario si está conectado
        const destinatario = usuarios.get(mensajeObj.destinatario);
        if (destinatario?.socketId) {
          io.to(destinatario.socketId).emit("new chat", msg);
        }
      } catch (error) {
        console.error("Error guardando mensaje:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
      for (const [usuarioId, info] of usuarios.entries()) {
        if (info.socketId === socket.id) {
          usuarios.set(usuarioId, { ...info, conectado: false });
          break;
        }
      }
      emitirListaUsuarios();
    });
  });
}
