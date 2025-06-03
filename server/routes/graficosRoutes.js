import { cantidadUsuarios } from "../controllers/estadisticasGraficos.js";
import { Router } from "express";

export const routerGraficos = Router();

routerGraficos.get('/graficos',cantidadUsuarios);
