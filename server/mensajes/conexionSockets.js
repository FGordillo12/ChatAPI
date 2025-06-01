import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT'],
      credentials: true,
    },
  });

  const mensajes = [];
  const usuarios = new Map(); // nombre => { socketId, conectado }

  // Función auxiliar para emitir la lista actualizada de usuarios
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
    console.log("Usuario conectado:", socket.id);

    socket.on("identify", ({ usuarioId, type }) => {
      socket.data = { usuarioId, type };
      usuarios.set(usuarioId, { socketId: socket.id, conectado: true, type });
      console.log(`Identificado: ${usuarioId} (${type})`);
      emitirListaUsuarios(); // Enviar a todos la lista de usuarios conectados
    });

    socket.on("new chat", (mensajeObj) => {
      const msg = {
        ...mensajeObj,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
      };
      mensajes.push(msg);
      console.log("Mensaje privado guardado:", msg);

      const destinatario = usuarios.get(mensajeObj.destinatario);
      if (destinatario?.socketId) {
        io.to(destinatario.socketId).emit("new chat", msg);
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
