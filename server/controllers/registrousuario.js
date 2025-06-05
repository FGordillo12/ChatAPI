//Importaciones para encriptar contraseñas, enviar correos e importar el modelo de usuario
import Usuario from '../models/usuarios.js';
import bcrypt from 'bcrypt'; 
import { generarTokenVerificacion, enviarCorreoVerificacion } from '../funciones/validarEmail.js';
// Función para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
    try {
      const { nombre, email, password, type } = req.body;
  
      //Validar que el nombre solo contenga caracteres alfabeticos
      const regexNombre = /^[a-zA-Z\s]+$/;
      if (!regexNombre.test(nombre)) {
        return res.status(400).json({
          status: 'error',
          error: [{message:"error1"}],
        });
      }
      // Validar si ya existe el usuario con ese correo
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(409).json({
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
      const token = generarTokenVerificacion();
      const nuevoRegistro = {
        nombre,
        email,
        password: passwordEncriptada,
        type,
        verificationToken: token
      };
      
      const sendMessage = await Usuario.create(nuevoRegistro); //Guardar el nuevo usuario en la base de datos
      await enviarCorreoVerificacion(nuevoRegistro, token); //Enviar correo de verificación
      // Respuesta exitosa
      res.status(201).json({ message: 'Usuario registrado con éxito' });
      
    } catch (error) { //Captura de errores y mostrar mensaje de error
      console.error('Error al registrar el usuario:', error);
      res.status(500).json({ message: 'Error al registrar el usuario' });
    }
  };
