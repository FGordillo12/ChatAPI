//Importamos el modelo de Usuario
import Mensaje from "../models/mensajes.js";
import Usuario from "../models/usuarios.js";
import mongoose from "mongoose";

//Consulta en la cantidad de mensajes escritos por un usuario en la base de datos
export const cantidadMensajesUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ type: "Usuario" });
    //si no hay usuarios de tipo "Usuario", se retorna un mensaje de error
    if (usuarios.length === 0) {
      return res.status(404).json({ message: "No hay usuarios de tipo 'Usuario'." });
    }
    //Por cada usuario, se cuenta cuantos mensajes ha enviado
    const usuariosConMensajes = await Promise.all(
      usuarios.map(async (user) => {
        const cantidadMensajes = await Mensaje.countDocuments({ remitente: user._id });
        return {
          nombre: user.nombre,
          cantidadMensajes
        };
      })
    );
    //Se envia la lista de usuarios con su respectiva cantidad de mensajes
    return res.status(200).json(usuariosConMensajes);

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};
//Funcion de cual es la cantidad de mensajes escritos diariamente
export const mensajesPorDia = async (req, res) => {
  try {
    const resultados = await Mensaje.aggregate([
      {
        $match: { 
          timestamp: { $type: "date" } // Asegura que el campo tenga fecha válida
        }
      },
      {
        $group: { //agrupacion de mensajes por fecha
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
    //Formatear los resultados para enviar al cliente
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

//Consulta la cantidad productos actualmente pedidos por todos los usuarios
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
    //Se formatea el resultado como arreglo de objetos
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

//Consulta la cantidad de mensajes por dia de un usuario especifico con el {id}
export const mensajesPorDiaUsuario = async (req, res) => {
  try {
    const { remitenteId } = req.params;
    //Se valida el ID del remitente
    if (!remitenteId || typeof remitenteId !== 'string') {
      return res.status(400).json({ message: "ID de remitente no válido" });
    }
    // Se agrupan los mensajes por fecha del remitente especificado
    const resultados = await Mensaje.aggregate([
      {
        $match: {
          remitente: remitenteId,
          timestamp: { $type: "date" }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          cantidadMensajes: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // Se agrupan los resultados por fecha
    const mensajesPorDia = resultados.map(d => ({
      fecha: d._id,
      cantidadMensajes: d.cantidadMensajes
    }));

    return res.status(200).json(mensajesPorDia);
  } catch (err) {
    console.error("Error al contar mensajes por día:", err); //Error al contar mensajes por día
    return res.status(500).json({ message: "Error del servidor", error: err.message }); //Error del servidor
  }
};
