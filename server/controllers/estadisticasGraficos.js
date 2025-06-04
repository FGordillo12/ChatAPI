import Mensaje from "../models/mensajes.js";
import Usuario from "../models/usuarios.js";


//Consulta en la cantidad de mensajes escritos por un usuario en la base de datos
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
//Consulta en la cantidad de mensajes escritos diariamente
export const mensajesPorDia = async (req, res) => {
  try {
    const resultados = await Mensaje.aggregate([
      {
        $match: {
          timestamp: { $type: "date" } // Asegura que el campo tenga fecha válida
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          },
          cantidadMensajes: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

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

export const consultarProductos = async (req, res) => {
  try {
    const mensajes = await Mensaje.find(); // orden ascendente por fecha

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


