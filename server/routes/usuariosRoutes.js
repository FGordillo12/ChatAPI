import express from 'express';
import { registrarUsuario } from '../controllers/registrousuario.js';
import { iniciarSesion } from '../controllers/sesionusuario.js';
import { actualizarUsuario } from '../controllers/actualizarUsuario.js';
import verifyToken from '../middlewares/token.js';

export const routerUsuarios = express.Router();

routerUsuarios.post('/registro', registrarUsuario);
routerUsuarios.post('/login', iniciarSesion);
routerUsuarios.patch('/perfil',verifyToken,actualizarUsuario)




