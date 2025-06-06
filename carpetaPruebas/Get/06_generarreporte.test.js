import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import Mensaje from '../../server/models/mensajes.js'; // Ajusta si tu ruta es distinta

describe('Reporte de mensajes', () => {
  const usuario1 = 'userA';
  const usuario2 = 'userB';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
  });

  afterAll(async () => {
    // Limpieza: eliminar mensajes entre usuario1 y usuario2 usados en prueba
    await Mensaje.deleteMany({
      $or: [
        { remitente: usuario1, destinatario: usuario2 },
        { remitente: usuario2, destinatario: usuario1 }
      ]
    });
    await mongoose.connection.close();
  });

  test('GET /api/reportes/:usuario1/:usuario2 debe generar reporte con status 201', async () => {
    // Insertar mensajes de prueba
    await Mensaje.insertMany([
      { remitente: usuario1, destinatario: usuario2, mensaje: 'manzanas: 3, peras: 5', timestamp: new Date() },
      { remitente: usuario2, destinatario: usuario1, mensaje: 'naranjas: 2', timestamp: new Date() },
      { remitente: usuario1, destinatario: usuario2, mensaje: 'Hola, ¿cómo estás?', timestamp: new Date() }
    ]);

    // Hacer la petición GET a la ruta correcta con prefijo /api
    const response = await request(app).get(`/api/reportes/${usuario1}/${usuario2}`);

    // Validaciones
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Reporte Creado con Éxito');
    expect(response.body).toHaveProperty('nombre');
    expect(response.body).toHaveProperty('ruta');
    expect(response.body.nombre).toMatch(new RegExp(`reporte_${usuario1}_y_${usuario2}\\.pdf`));
  });
});

