

import Usuario from '../models/usuarios.js';
import bcrypt from 'bcrypt'; 

const registrarusuario = async (req, res) => {
    try {
      const { nombreCompleto, email, password, type } = req.body;
  
      // Validar si ya existe el usuario con ese correo
      const usuarioExistente = await Usuario.findOne({ email });
  
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado' });
      }
  
      // Encriptar la contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordEncriptada = await bcrypt.hash(password, salt);
  
      const nuevoRegistro = new Usuario({
        nombreCompleto,
        email,
        password: passwordEncriptada,
        type,
      });
  
      await nuevoRegistro.save();
      res.status(200).json({ message: 'Usuario registrado con éxito' });
      
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  };
  

export { registrarusuario };

