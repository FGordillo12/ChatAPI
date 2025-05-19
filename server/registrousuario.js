import Usuario from '../models/usuarios.js';
import bcrypt from 'bcrypt'; 

const registrarusuario = async (req, res) => {
    try {
      const { nombreCompleto, email, password, type } = req.body;
  
      //Validar que el nombre solo contenga caracteres alfabeticos
      const regexNombre = /^[a-zA-Z\s]+$/;
      if (!regexNombre.test(nombreCompleto)) {
        return res.status(400).json({
          status: 'error',
          error: [{message:"error1"}],
        });
      }
      // Validar si ya existe el usuario con ese correo
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({
          status: 'error',
          error: [{message:"error4"}],
        });
      }

      // Validar el formato de la contraseña
      const regexPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!regexPassword.test(password)) {
        return res.status(400).json({ 
          status: 'error',
          error: [{message:"error3"}],
        });
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
      res.status(201).json({ message: 'Usuario registrado con éxito' });
      
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  };
  

export { registrarusuario };

