//Importaciones necesarias de base de datos y encriptacion 
import Usuario from '../models/usuarios.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
// Función para enviar un correo de recuperación de contraseña
export const enviarCorreoPassword = async (req, res) => {

  const { email } = req.body;
  // Busca al usuario por email
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    //Generar token de recuperacion de contraseña
    const token = crypto.randomBytes(32).toString('hex');
    usuario.resetPasswordToken = token;
    usuario.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await usuario.save();

    // Configura el transporte de nodemailer (puede ser Gmail o SMTP)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'pruebasCdisfruta@gmail.com',
        pass: 'oxdlbhjcrqpfziuj'
      },
    });
    //Enlace que se enviara al usuario para restablecer la contraseña
    const enlace = `http://localhost:5173/restablecer_password/${token}`;
    // Envía el correo electrónico
    await transporter.sendMail({
      to: usuario.email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${enlace}">${enlace}</a>`,
    });
    //Confirmacion de envio del correo
    res.status(200).json({ message: 'Enlace de recuperación enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
  }
}

//Funcion que restablece la contraseña del usuario
export const restablecerPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try { //Busca al usuario que tenga el token de restablecimiento valido
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, //Verifica que el token no haya expirado
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
    //Generar un nuevo hash de contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.resetPasswordToken = undefined; //Eliminar token y fecha de expiracion
    usuario.resetPasswordExpires = undefined;
    //Guarda los cambios en el usuario
    await usuario.save();
    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};