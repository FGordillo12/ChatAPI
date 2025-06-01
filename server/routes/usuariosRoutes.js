import express from 'express';
import { registrarUsuario } from '../controllers/registrousuario.js';
import { iniciarSesion } from '../controllers/sesionusuario.js';
import { actualizarUsuario } from '../controllers/actualizarUsuario.js';
import verifyToken from '../middlewares/token.js';
import { verificarCuenta } from '../controllers/verificarCuenta.js';
import { restablecerPassword, enviarCorreoPassword } from '../controllers/recuperarPassword.js';
import { getUsuarios, getEmpresas } from '../controllers/consultarUsuarios.js';
import { buscarMensaje } from '../controllers/consultarMensajes.js';

export const routerUsuarios = express.Router();

routerUsuarios.post('/registro', registrarUsuario);

routerUsuarios.post('/login', iniciarSesion);

routerUsuarios.patch('/perfil',verifyToken,actualizarUsuario)

routerUsuarios.post('/recuperar_password',enviarCorreoPassword)
routerUsuarios.patch('/restablecer_password/:token', restablecerPassword);

routerUsuarios.get('/validacion/:token', verificarCuenta);

routerUsuarios.get('/usuarios', getUsuarios);
routerUsuarios.get('/empresas', getEmpresas);

routerUsuarios.get('/mensajes/:usuario1/:usuario2', buscarMensaje);

