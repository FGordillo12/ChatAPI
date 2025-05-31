import { Server } from "socket.io";

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT'],
      credentials: true
    }
  });

  const mensajes = [];

  io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");

    socket.emit("previous messages", mensajes);

    socket.on("chat message", ({ mensaje, nombre, rol }) => {
      const msg = { mensaje, nombre, rol };
      mensajes.push(msg);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Un usuario se ha desconectado");
    });
  });
}
