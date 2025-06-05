//importacion de servidor socket y modelo para guardar mensajes
import { Server } from "socket.io";
import Mensaje from "../models/mensajes.js" // Ajusta la ruta según tu estructura

export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173', //permite el frontend a conectarse
      methods: ['GET', 'POST', 'PATCH', 'PUT'],
      credentials: true,
    },
  });
  // Mapa para almacenar usuarios conectados
  const usuarios = new Map(); // nombre => { socketId, conectado }

  // Función para emitir la lista de usuarios conectados
  function emitirListaUsuarios() {
    const usuariosFiltrados = Array.from(usuarios.entries())
      .filter(([usuarioId, info]) => info.conectado && info.type === 'Usuario')
      .map(([usuarioId, info]) => ({
        id: usuarioId,
        conectado: info.conectado,
      }));

    io.emit("usuarios conectados", usuariosFiltrados); //Envia la lista de usuarios conectados al cliente
    console.log(usuariosFiltrados);
  }

  // Evento para identificar nuevos usuarios que se conectan al servidor
  io.on("connection", (socket) => {
    socket.on("identify", ({ usuarioId, type }) => { //guarda los datos del socket
      socket.data = { usuarioId, type };
      usuarios.set(usuarioId, { socketId: socket.id, conectado: true, type }); //Almacena el usuario que esta conectado
      console.log(`Identificado: ${usuarioId} (${type})`);
      emitirListaUsuarios(); // Emite la lista de usuarios conectados
    });

    // Evento para recibir mensajes nuevos
    socket.on("new chat", async (mensajeObj) => {
      const msg = {
        remitente: mensajeObj.remitente,
        destinatario: mensajeObj.destinatario,
        mensaje: mensajeObj.mensaje || "",
        timestamp: new Date(), 
        id: Date.now().toString(), //Genera un ID temporal para el mensaje
      };

      // Si en el mensaje hay un archivo, lo convertimos a Buffer
      if (mensajeObj.archivo?.datos) {
        msg.archivo = {
          datos: Buffer.from(mensajeObj.archivo.datos, 'base64'),
          tipo: mensajeObj.archivo.tipo,
          nombre: mensajeObj.archivo.nombre
        };
      }
      try { //Guarda el mensaje en la base de datos
        const mensajeGuardado = new Mensaje(msg);
        await mensajeGuardado.save();
        console.log("Mensaje guardado en DB:", mensajeGuardado);

        //Si el destinatario está conectado, le envia el mensaje
        const destinatario = usuarios.get(mensajeObj.destinatario);
        if (destinatario?.socketId) {
          io.to(destinatario.socketId).emit("new chat", {
            ...msg,
            archivo: {
              datos: mensajeObj.archivo?.datos, // Reenviamos base64 al cliente receptor
              tipo: mensajeObj.archivo?.tipo,
              nombre: mensajeObj.archivo?.nombre
            }
          });
        }
      } catch (error) {
        console.error("Error guardando mensaje:", error); // Mensaje de error al guardar el mensaje
      }
    });

    socket.on("disconnect", () => { // Evento para cuando el usuario se desconecta
      console.log("Usuario desconectado:", socket.id);
      for (const [usuarioId, info] of usuarios.entries()) { // Itera sobre los usuarios conectados
        if (info.socketId === socket.id) {
          usuarios.set(usuarioId, { ...info, conectado: false });
          break;
        }
      }
      emitirListaUsuarios(); //Muestra la lista de usuarios conectados
    });
  });
}
