import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT'],
      credentials: true,
    },
  });

  // Almacenar todos los mensajes (públicos y privados)
  const mensajes = [];
  const usuarios = new Map();

  io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("identify", ({ nombre, type }) => {
      socket.data = { nombre, type };
      usuarios.set(nombre, socket.id); // Guardar su socket.id por nombre
      console.log(`Identificado: ${nombre} (${type})`);
    });

    // Manejo de mensajes privados
    socket.on("new chat", (mensajeObj) => {
      const msg = {
        ...mensajeObj,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };
      mensajes.push(msg);
      console.log("Mensaje privado guardado:", msg);


      const destinatarioSocketId = usuarios.get(mensajeObj.destinatario);
      console.log(destinatarioSocketId);

      if (destinatarioSocketId) {
        io.to(destinatarioSocketId).emit("new chat", msg);
      }


    });


    socket.on("disconnect", () => {
      console.log("Usuario desconectado:", socket.id);
    });
  });
}