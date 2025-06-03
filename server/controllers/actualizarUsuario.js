import jwt from 'jsonwebtoken';
import Usuario from '../models/usuarios.js';

export const actualizarUsuario = async (req, res) => {
  const userId = req.usuario.id;
  const { nombre, email } = req.body;

  try {
    const usuario = await Usuario.findByIdAndUpdate(
      userId,
      { nombre, email },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

     const token = jwt.sign(
          { id: usuario._id, nombre: usuario.nombre,  email: usuario.email, type: usuario.type },
          process.env.JWT_TOKEN,
          { expiresIn: "1h" }
        );
    
        res.cookie('token', token, {
          httpOnly: true,
          secure: false,       
          sameSite: 'lax',      
          maxAge: 3600000,
        });
        res.status(200).json({
          message: "Actualizacion exitosa",
          nombre: usuario.nombre,
          email: usuario.email,
          type: usuario.type
        });
         

  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
  }
};
