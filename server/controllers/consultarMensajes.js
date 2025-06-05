//importacion de los modelos
import Mensaje from "../models/mensajes.js";

// Funcion encargada de buscar mensajes entre dos usuarios
export const buscarMensaje = async (req, res) => {
  const { usuario1, usuario2 } = req.params; //usuarios que estan chateando desde la URL

  // Validaciones de los datos recibidos
  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: usuario1, destinatario: usuario2 },
        { remitente: usuario2, destinatario: usuario1 }
      ]
    }).sort({ timestamp: 1 }); // orden de mensajes mas antiguos a mas recientes por fecha

    // Si no se encuentran mensajes, se devuelve un mensaje de error
    res.json({ mensajes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

//Funcion encargada de actualizar un mensaje
export const actualizarMensajes = async (req, res) => {
  const { id } = req.params;
  const { mensaje } = req.body;
  try {
    const mensajeActualizado = await Mensaje.findByIdAndUpdate(id, { mensaje }, { new: true });// Broadcast
    res.json({ mensaje: mensajeActualizado });
  } catch (err) {
    res.status(500).json({ error: 'Error al editar el mensaje' });
  }
};

// Funcion encargada de eliminar un mensaje
export const eliminarMensajes = async (req, res) => {
  const { id } = req.params;
  try {
    await Mensaje.findByIdAndDelete(id);
    res.json({ mensaje: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el mensaje' });
  }
};

//Funcion encargada de consultar los mensajes entre dos usuarios
export const consultarInfoMensajes = async (req, res) => {
  const { usuario1, usuario2 } = req.params;

  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: usuario1, destinatario: usuario2 },
        { remitente: usuario2, destinatario: usuario1 }
      ]
    }).sort({ timestamp: 1 }); // orden ascendente por fecha

    const mensajesTexto = mensajes
      .filter(m => m.mensaje)
      .map(m => m.mensaje);

    // Filtrar mensajes con productos
    const mensajesProductos = mensajesTexto.filter(text => {
      return /[a-zA-Z]+:\s*\d+/.test(text);
    });

    const productos = {};

    mensajesProductos.forEach(mensaje => {
      // Separar por comas
      const items = mensaje.split(',');

      items.forEach(item => {
        // Quitar espacios y separar nombre y cantidad
        const [nombre, cantidad] = item.split(':').map(str => str.trim());

        if (nombre && cantidad && !isNaN(cantidad)) {
          productos[nombre] = Number(cantidad);
        }
      });
    });

    // Se convierten los productos en una lista 
    const productosFormateados = Object.entries(productos).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
    res.json(productosFormateados); //Se envían los productos encontrados


  //Si ocurre un error se devuelve un mensaje de error
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

