//importaciones de crypto y nodemailer para generar tokens aleatorios y enviar correos electrónicos
import crypto from 'crypto';
import nodemailer from 'nodemailer';
//
export const generarTokenVerificacion = () => { // Función para generar un token de verificación aleatorio
  return crypto.randomBytes(32).toString('hex'); //Generacion de token de verificación utilizando crypto
};
// Función para enviar un correo electrónico de verificación al usuario
export const enviarCorreoVerificacion = async (usuario, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Configuración del servicio de correo electrónico
    auth: {
      user: 'pruebasCdisfruta@gmail.com', 
      pass: 'oxdlbhjcrqpfziuj' 
    }
  });

  // URL de verificación que se enviará al usuario
  const verificationUrl = `http://localhost:3000/api/validacion/${token}`;

  // Opciones y cuerpo del correo electrónico que se enviará al usuario
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

  //Envio del correo electronico con las funciones definidas
  await transporter.sendMail(mailOptions);
};
