//Importaciones de funciones de controladores
import {
  cantidadMensajesUsuarios, //Controlador para obtener la cantidad de mensajes por usuario
  mensajesPorDia, //Controlador para obtener mensajes por día
  consultarProductos, //Controlador para consultar productos
  mensajesPorDiaUsuario //Controlador para obtener mensajes por día de un usuario específico
} 

from "../controllers/estadisticasGraficos.js"; // Importación de controladores para las rutas de gráficos

import { Router } from "express"; // Importación del Router de Express

export const routerGraficos = Router();
// Definición de las rutas para los gráficos
routerGraficos.get('/graficos_mensajes_usuario', cantidadMensajesUsuarios); // Ruta para obtener la cantidad de mensajes por usuario
routerGraficos.get('/graficos_mensajes_diarios', mensajesPorDia); // Ruta para obtener mensajes por día
routerGraficos.get('/graficos_productos', consultarProductos);// Ruta para consultar productos
routerGraficos.get('/graficos_mensajes_diarios/:remitenteId', mensajesPorDiaUsuario); // Ruta para obtener mensajes por día de un usuario específico