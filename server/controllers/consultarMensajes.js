import Mensaje from "../models/mensajes.js";

export const buscarMensaje = async (req, res) => {
  const { usuario1, usuario2 } = req.params;

  try {
    const mensajes = await Mensaje.find({
      $or: [
        { remitente: usuario1, destinatario: usuario2 },
        { remitente: usuario2, destinatario: usuario1 }
      ]
    }).sort({ timestamp: 1 }); // orden ascendente por fecha

    res.json({ mensajes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};


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

export const eliminarMensajes = async (req, res) => {
  const { id } = req.params;
  try {
    await Mensaje.findByIdAndDelete(id);
    res.json({ mensaje: 'Mensaje eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el mensaje' });
  }
};

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

    const productosFormateados = Object.entries(productos).map(([nombre, cantidad]) => ({
      nombre,
      cantidad,
    }));
    res.json(productosFormateados);



  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

