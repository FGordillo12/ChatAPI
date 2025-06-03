import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { routerUsuarios } from "./server/routes/usuariosRoutes.js";
import { routerPagina } from "./server/routes/paginaRoutes.js";
import { routerGraficos } from "./server/routes/graficosRoutes.js";

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

// Rutas
app.use('/api/', routerUsuarios);
app.use('/api/', routerPagina);
app.use('/api/', routerGraficos);

export default app;
