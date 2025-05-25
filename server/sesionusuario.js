import Usuario from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // ✅ Generar el token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, type: usuario.type },
      process.env.JWT_SECRET || "clave-secreta", // reemplázalo por una env segura
      { expiresIn: "1h" }
    );
  //DEVOLVER EL TOKEN
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombreCompleto: usuario.nombreCompleto,
        email: usuario.email,
        type: usuario.type
      }
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export { iniciarSesion };