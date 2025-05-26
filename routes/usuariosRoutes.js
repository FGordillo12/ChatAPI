import express from 'express';
import { registrarusuario } from '../controllers/registrousuario.js';
import { iniciarSesion } from '../controllers/sesionusuario.js';
import verifyToken from '../middlewares/token.js';

export const routerUsuarios = express.Router();

routerUsuarios.post('/registro', registrarusuario);
routerUsuarios.post('/login', iniciarSesion);






