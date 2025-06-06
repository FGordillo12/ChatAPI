//Importaciones de controladores para las rutas de gráficos
import 'dotenv/config';
import { createServer } from "node:http";
import connectiondDb from './server/database/conexion.js';
import app from './app.js';
import { setupSocket } from './server/mensajes/conexionSockets.js';

const PORT = process.env.PORT || 3000; //Puerto del servidor, por defecto 3000

// Crear servidor HTTP a partir de la app de Express
const server = createServer(app);

// Configurar Socket.IO
setupSocket(server);

// Iniciar servidor y base de datos
const startServer = async () => {
  try {
    await connectiondDb();
    if (process.env.NODE_ENV !== 'test') {
      server.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}`);
      });
    }
  } catch (error) { //Muestra errores en consola si falla la conexión a la base de datos o al iniciar el servidor
    console.error('Error al iniciar el servidor:', error);
    process.exit(1); //Fin del proceso con error
  }
};

startServer(); // Inicia el servidor y la conexión a la base de datos

