import Usuario from "../models/usuarios.js";
export const verificarCuenta = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await Usuario.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send('Token de verificación inválido o expirado.');
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect('http://localhost:5173/login');
  } catch (err) {
    res.status(500).send('Error al verificar la cuenta.');
  }
};