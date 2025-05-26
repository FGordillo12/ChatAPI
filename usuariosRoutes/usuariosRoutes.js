import express from 'express';
import { registrarusuario } from '../server/registrousuario.js';
import { iniciarSesion } from '../server/sesionusuario.js';
import verifyToken from '../server/middlewares/token.js';

const router = express.Router();

router.post('/registro', registrarusuario);
router.post('/login', iniciarSesion);
router.get('/chat', verifyToken, (req, res) => {
  res.status(200).json({
    usuario: req.usuario
  });
  
});

export default router;

