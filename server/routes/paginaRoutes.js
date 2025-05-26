import express from 'express';
import verifyToken from '../middlewares/token.js';

export const routerPagina = express.Router();

routerPagina.get('/chat', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

routerPagina.get('/main-page', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

routerPagina.get('/perfil', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
});

routerPagina.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, 
    sameSite: 'strict',
    path: '/' 
  });

  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});
