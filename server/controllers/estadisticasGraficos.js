import Mensaje from "../models/mensajes.js";
import Usuario from "../models/usuarios.js";

export const cantidadMensajesUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ type: "Usuario" });

    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No hay usuarios de tipo 'Usuario'." });
    }

    const usuariosConMensajes = await Promise.all(
      usuarios.map(async (user) => {
        const cantidadMensajes = await Mensaje.countDocuments({ remitente: user._id });
        return {
          nombre: user.nombre,
          cantidadMensajes
        };
      })
    );

    return res.status(200).json(usuariosConMensajes);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};

export const mensajesPorDia = async (req, res) => {
  try {
    const resultados = await Mensaje.aggregate([
      {
        // Convertimos la fecha de creación a solo el día (sin hora)
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          cantidadMensajes: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Ordena por fecha ascendente
      }
    ]);

    // Cambiar _id por fecha para mayor claridad
    const mensajesPorDia = resultados.map(d => ({
      fecha: d._id,
      cantidadMensajes: d.cantidadMensajes
    }));

    return res.status(200).json(mensajesPorDia);

  } catch (err) {
    console.error("Error al contar mensajes por día:", err);
    return res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};
