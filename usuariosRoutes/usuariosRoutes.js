import express from 'express';
import { registrarusuario } from '../server/registrousuario.js';

const router = express.Router();

router.post('/registro', registrarusuario);

export default router;
