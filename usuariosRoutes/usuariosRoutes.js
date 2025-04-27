import express from 'express';
import { registrarusuario } from '../server/registrousuario.js';
import { iniciarSesion } from '../server/sesionusuario.js';


const router = express.Router();

router.post('/registro', registrarusuario);
router.post('/login', iniciarSesion);
    

export default router;

