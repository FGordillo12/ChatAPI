//Importacion de libreria para verificar el token JWT
import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; //Obtiene el token del cookie

  if (!token) { //Si no hay token, muestra un error
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try { //Verifica que el token sea valido 
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.usuario = decoded;  //Si el token es valido, guarda los datos del usuario en la request
    next();
  } catch (error) { //Si el token no es valido, muestra un error
    return res.status(403).json({ message: "Token inválido" });
  }
};

export default verifyToken; // Exporta el middleware para usarlo en otras partes de la aplicación