import Usuario from "../models/usuarios.js";
import bcrypt from "bcrypt";

const iniciarSesion = async (req, res) => {
  const { email_login, password_login } = req.body;

  try {
    const usuario = await Usuario.findOne({ email: email_login });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password_login, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    res.status(200).json({ message: "Inicio de sesión exitoso", usuario });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export { iniciarSesion };
