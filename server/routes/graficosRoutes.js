import {
  cantidadMensajesUsuarios,
  mensajesPorDia,
  consultarProductos,
  mensajesPorDiaUsuario
} 
from "../controllers/estadisticasGraficos.js";

import { Router } from "express";

export const routerGraficos = Router();

routerGraficos.get('/graficos_mensajes_usuario', cantidadMensajesUsuarios);
routerGraficos.get('/graficos_mensajes_diarios', mensajesPorDia);
routerGraficos.get('/graficos_productos', consultarProductos);
routerGraficos.get('/graficos_mensajes_diarios/:remitenteId', mensajesPorDiaUsuario);