import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.usuario = decoded; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};

export default verifyToken;