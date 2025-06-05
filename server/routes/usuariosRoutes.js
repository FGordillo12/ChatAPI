//Importaciones de rutas y controladores de Express
import express from 'express';
import { registrarUsuario } from '../controllers/registrousuario.js';
import { iniciarSesion } from '../controllers/sesionusuario.js';
import { actualizarUsuario } from '../controllers/actualizarUsuario.js';
import verifyToken from '../middlewares/token.js';
import { verificarCuenta } from '../controllers/verificarCuenta.js';
import { restablecerPassword, enviarCorreoPassword } from '../controllers/recuperarPassword.js';
import { getUsuarios, getEmpresas } from '../controllers/consultarUsuarios.js';
import { buscarMensaje, actualizarMensajes, eliminarMensajes, consultarInfoMensajes} from '../controllers/consultarMensajes.js';
import { generarReporteMensajes } from '../controllers/generarReporte.js';

export const routerUsuarios = express.Router(); //Creación del Router de Express para manejar las rutas de usuarios

routerUsuarios.post('/registro', registrarUsuario); //Ruta para registrar un nuevo usuario

routerUsuarios.post('/login', iniciarSesion); //Ruta para iniciar sesión de un usuario

routerUsuarios.patch('/perfil',verifyToken,actualizarUsuario) // Ruta para actualizar el perfil del usuario, requiere verificación de token

routerUsuarios.post('/recuperar_password',enviarCorreoPassword) // Ruta para enviar un correo con enlace de recuperación de contraseña
routerUsuarios.patch('/restablecer_password/:token', restablecerPassword); // Ruta para restablecer la contraseña utilizando el token enviado al correo

routerUsuarios.get('/validacion/:token', verificarCuenta); // Ruta para verificar la cuenta de un usuario mediante un token enviado por correo

routerUsuarios.get('/usuarios', getUsuarios); // Ruta para obtener todos los usuarios registrados
routerUsuarios.get('/empresas', getEmpresas); // Ruta para obtener todas las empresas registradas

routerUsuarios.get('/mensajes/:usuario1/:usuario2', buscarMensaje); // Ruta para buscar mensajes entre dos usuarios específicos

routerUsuarios.get('/estadisticas/:usuario1/:usuario2', consultarInfoMensajes); // Ruta para obtener estadísticas de mensajes entre dos usuarios
routerUsuarios.patch('/mensajes/:id', actualizarMensajes); // Ruta para actualizar el contenido de un mensaje específico
routerUsuarios.delete('/mensajes/:id', eliminarMensajes); // Ruta para eliminar un mensaje específico

//REPORTES

routerUsuarios.get('/reportes/:usuario1/:usuario2', generarReporteMensajes); // Ruta para generar un reporte de mensajes entre dos usuarios