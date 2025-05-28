import Usuario from '../models/usuarios.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

export const enviarCorreoPassword = async (req, res) => {

  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

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

    const enlace = `http://localhost:5173/restablecer_password/${token}`;

    await transporter.sendMail({
      to: usuario.email,
      subject: 'Recuperación de contraseña',
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${enlace}">${enlace}</a>`,
    });

    res.status(200).json({ message: 'Enlace de recuperación enviado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
  }
}


export const restablecerPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!usuario) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    await usuario.save();
    res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
};