import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Mensaje from '../../server/models/mensajes.js';

dotenv.config();

describe('Estadísticas de mensajes', () => {
  const usuarioA = 'userA';
  const usuarioB = 'userB';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Insertar mensajes de prueba con productos en el texto
    const mensajesPrueba = [
      {
        remitente: usuarioA,
        destinatario: usuarioB,
        mensaje: 'manzanas: 3, naranjas: 5',
        timestamp: new Date('2025-06-01T10:00:00Z'),
      },
      {
        remitente: usuarioB,
        destinatario: usuarioA,
        mensaje: 'peras: 2',
        timestamp: new Date('2025-06-01T10:01:00Z'),
      },
      {
        remitente: usuarioA,
        destinatario: usuarioB,
        mensaje: 'manzanas: 2',  // para test que suma cantidades por producto (si aplica)
        timestamp: new Date('2025-06-01T10:02:00Z'),
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
    await new Promise(resolve => setTimeout(resolve, 0)); // evitar hangs en Jest
  });

  test('GET /api/estadisticas/:usuario1/:usuario2 debe devolver productos y cantidades', async () => {
    const response = await request(app).get(`/api/estadisticas/${usuarioA}/${usuarioB}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Revisar que existan productos específicos con las cantidades esperadas
    // Nota: Según tu controller, los productos se sobrescriben y no suman cantidades repetidas,
    // así que manzanas tendrá la última cantidad (2).
    const productos = response.body;

    // Busca producto manzanas y verifica cantidad
    const manzanas = productos.find(p => p.nombre === 'manzanas');
    expect(manzanas).toBeDefined();
    expect(manzanas.cantidad).toBe(2);

    const naranjas = productos.find(p => p.nombre === 'naranjas');
    expect(naranjas).toBeDefined();
    expect(naranjas.cantidad).toBe(5);

    const peras = productos.find(p => p.nombre === 'peras');
    expect(peras).toBeDefined();
    expect(peras.cantidad).toBe(2);
  });
});
