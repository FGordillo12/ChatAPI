import { cantidadMensajesUsuarios, mensajesPorDia, consultarProductos} from "../controllers/estadisticasGraficos.js";
import { Router } from "express";

export const routerGraficos = Router();

routerGraficos.get('/graficos_mensajes_usuario',cantidadMensajesUsuarios);
routerGraficos.get('/graficos_mensajes_diarios',mensajesPorDia);
routerGraficos.get('/graficos_productos',consultarProductos);