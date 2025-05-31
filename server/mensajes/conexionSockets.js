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
  const empresasConectadas = new Map(); // socket.id -> empresa info

  io.on("connection", (socket) => {
    console.log("Un usuario se ha conectado");

    socket.emit("previous messages", mensajes);

    socket.on("identify", (userInfo) => {
      if (userInfo.type === "Empresa") {
        empresasConectadas.set(socket.id, userInfo);
        console.log(`Empresa conectada: ${userInfo.nombre}`);
      } else if (userInfo.type === "Usuario") {
        console.log(`Usuario conectado: ${userInfo.nombre}`);
      }
    });

    socket.on("chat message", ({ mensaje, nombre, rol }) => {
      const msg = { mensaje, nombre, rol };
      mensajes.push(msg);
      io.emit("chat message", msg);
    });

    socket.on("get empresas conectadas", () => {
      // Solo usuarios pueden pedir esta info
      const user = socket.handshake.auth?.userInfo;
      if (user?.type === "Usuario" || !user) {
        const listaEmpresas = Array.from(empresasConectadas.values());
        socket.emit("empresas conectadas", listaEmpresas);
      }
    });

    socket.on("disconnect", () => {
      if (empresasConectadas.has(socket.id)) {
        console.log(`Empresa desconectada: ${empresasConectadas.get(socket.id).nombre}`);
        empresasConectadas.delete(socket.id);
      }
      console.log("Un usuario se ha desconectado");
    });
  });
}
