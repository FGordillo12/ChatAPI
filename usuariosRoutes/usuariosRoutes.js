import express from 'express';
import { registrarusuario } from '../server/registrousuario.js';
import { iniciarSesion } from '../server/sesionusuario.js';
import verifyToken from '../server/middlewares/token.js';

export const routerUsuarios = express.Router();

routerUsuarios.post('/registro', registrarusuario);
routerUsuarios.post('/login', iniciarSesion);






