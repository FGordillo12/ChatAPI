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