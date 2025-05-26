import express from 'express';
import { registrarusuario } from '../server/registrousuario.js';
import { iniciarSesion } from '../server/sesionusuario.js';
import verifyToken from '../server/middlewares/token.js';

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


routerPagina.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // ponlo en true si usas HTTPS
    sameSite: 'Lax', // o 'Strict' o 'None' si necesitas
    path: '/' // asegúrate que coincida con la cookie original
  });

  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});
