//importaciones de generacion de token, encriptacion de contraseña y modelo de usuario
import Usuario from "../models/usuarios.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const iniciarSesion = async (req, res) => {
  const { email, password } = req.body; //ingresa por el email y la contraseña

  try { //busca el usuario por email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) { //si no existe el usuario, retorna un error
      return res.status(401).json({ message: "Credenciales inválidas" });
    }
    if (!usuario.verified) { //verificar si el usuario ya verifico la cuenta
      return res.status(403).json({
        status: 'error',
        message: 'Debes verificar tu cuenta por correo antes de iniciar sesión.'
      });
    } //comparar la contraseña ingresada con la almacenada en la base de datos
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Generar el token JWT con los datos del usuario
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email, type: usuario.type },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    //enviar el token como cookie y respuesta JSON
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 3600000,
    });
    //respuesta exitosa con los datos del usuario y el token
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        type: usuario.type,
        rol: usuario?.type, 
      },
      token
    });
    //error en caso de que ocurra un problema al iniciar sesión
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
