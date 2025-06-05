//importaciones de librerias y modelos necesarios
import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarios.js';

// Funcion encargada de actualizar el perfil del usuario
export const actualizarUsuario = async (req, res) => {
  const userId = req.usuario.id;
  const { nombre, email } = req.body;

// Validaciones de los datos recibidos
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      userId,
      { nombre, email },
      { new: true }
    );
    // Si no se encuentra el usuario, se devuelve un mensaje de error
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    //se crea un nuevo token con los datos actualizados del usuario
     const token = jwt.sign(
          { id: usuario._id, nombre: usuario.nombre,  email: usuario.email, type: usuario.type },
          process.env.JWT_TOKEN,
          { expiresIn: "1h" } //token valido por 1 hora
        );
    
        //se guarda el token en una cookie para que el usuario siga conectado
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,       
          sameSite: 'lax',      
          maxAge: 3600000,
        });
        //responde exitosamente con los datos actualizados del usuario
        res.status(200).json({
          message: "Actualizacion exitosa",
          nombre: usuario.nombre,
          email: usuario.email,
          type: usuario.type
        });
         

  // Si ocurre un error, se captura y devuelve un mensaje de error
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
  }
};
