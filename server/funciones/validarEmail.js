import crypto from 'crypto';
import nodemailer from 'nodemailer';

export const generarTokenVerificacion = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const enviarCorreoVerificacion = async (usuario, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'pruebasCdisfruta@gmail.com',
      pass: 'oxdlbhjcrqpfziuj'
    }
  });

  const verificationUrl = `http://localhost:3000/api/validacion/${token}`;

  const mailOptions = {
    from: '"AMG - Plataforma gestionada a CDISFRUTA" <pruebascdisfruta@gmail.com>',
    to: usuario.email,
    subject: 'Confirmación de correo electronico - Registro en CDIFRUTA',
    html: `
      <p>Estimado(a) ${usuario.name}</p>
      <p><br>Gracias por registrarse en <b>AMG</b>.</br></p>
      <p>Para completar su proceso de registro y activar su cuenta, le solicitamos verificar su dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Este paso es fundamental para confirmar que la dirección proporcionada es válida y pertenece a usted.</p>
      <p><br>Este mensaje ha sido enviado por <b>AMG – Aplicativo Moderno de Gestión</b>, plataforma que respalda tecnológicamente el funcionamiento de CDISFRUTA.</br></p>
      <p>Si usted no ha realizado este registro, puede ignorar este mensaje con toda seguridad.</p>
      <p><br>Agradecemos su confianza.</br></p>
      <p>Atentamente,</p>
      <p><b>Equipo de Soporte</b> – AMG</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
