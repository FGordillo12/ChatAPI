import Mensaje from "../models/mensajes.js";
import Usuario from "../models/usuarios.js";

export const cantidadUsuarios = async (req, res) => {
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
