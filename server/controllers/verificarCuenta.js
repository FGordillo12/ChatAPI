//importacion de dependencias 
import Usuario from "../models/usuarios.js";
export const verificarCuenta = async (req, res) => { //verifica la cuenta del usuario
  const { token } = req.params; //token de verificación enviado por correo electrónico
  try {
    const user = await Usuario.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send('Token de verificación inválido o expirado.'); // si no se encuentra el usuario con el token, retorna un error
    }

    // Verifica si el usuario ya está verificado
    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirige al usuario a la página de inicio de sesión
    res.redirect('http://localhost:5173/login');
  } catch (err) {
    res.status(500).send('Error al verificar la cuenta.'); //error en caso de que ocurra un problema al verificar la cuenta
  }
};