import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Mensaje from '../../server/models/mensajes.js';

dotenv.config();

describe('Mensajes entre usuarios', () => {
  const usuarioA = 'userA';
  const usuarioB = 'userB';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Insertar mensajes de prueba entre usuarioA y usuarioB
    const mensajesPrueba = [
      {
        remitente: usuarioA,
        destinatario: usuarioB,
        mensaje: 'Hola, ¿cómo estás?',
        timestamp: new Date('2025-06-01T10:00:00Z'),
      },
      {
        remitente: usuarioB,
        destinatario: usuarioA,
        mensaje: 'Bien, gracias. ¿Y tú?',
        timestamp: new Date('2025-06-01T10:01:00Z'),
      },
    ];

    await Mensaje.insertMany(mensajesPrueba);
  });

  afterAll(async () => {
    // Limpiar mensajes de prueba
    await Mensaje.deleteMany({
      $or: [
        { remitente: usuarioA, destinatario: usuarioB },
        { remitente: usuarioB, destinatario: usuarioA },
      ],
    });
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0)); // para evitar que Jest quede colgado
  });

  test('GET /api/mensajes/:usuario1/:usuario2 debe devolver mensajes entre dos usuarios', async () => {
    const response = await request(app).get(`/api/mensajes/${usuarioA}/${usuarioB}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('mensajes');
    expect(Array.isArray(response.body.mensajes)).toBe(true);

    // Verificar que mensajes de prueba estén en la respuesta
    const mensajes = response.body.mensajes;

    expect(mensajes.length).toBeGreaterThanOrEqual(2);

    const contenidoMensajes = mensajes.map(m => m.mensaje);
    expect(contenidoMensajes).toContain('Hola, ¿cómo estás?');
    expect(contenidoMensajes).toContain('Bien, gracias. ¿Y tú?');
  });
});
