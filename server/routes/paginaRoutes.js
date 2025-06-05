//importaciones de express y el middleware de verificación de token
import express from 'express';
import verifyToken from '../middlewares/token.js';

export const routerPagina = express.Router(); // Importación del Router de Express

//Ruta protegida que verifica el token antes de acceder a las páginas
routerPagina.get('/chat', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

//Ruta protegida que verifica el token antes de acceder a la página principal
routerPagina.get('/main-page', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

//Ruta protegida que verifica el token antes de acceder a la página de perfil
routerPagina.get('/perfil', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

//Ruta protegida que verifica el token antes de acceder a la página de mensajes
routerPagina.delete('/mensajes/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  res.status(200).json({
    deleted: true,
    id
  });
});


// Ruta para cerrar sesión, elimina el token de la cookie
routerPagina.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, 
    sameSite: 'strict',
    path: '/' 
  });

  return res.status(200).json({ message: 'Sesión cerrada correctamente' }); //Mensaje de éxito al cerrar sesión
});
