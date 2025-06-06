import request from 'supertest';
import app from '../../app.js';
import Usuario from '../../server/models/usuarios.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  // Conectar a la base de datos de pruebas
  await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

  // Crear el usuario si no existe
  const existente = await Usuario.findOne({ email: 'santytorres879@gmail.com' });
  if (!existente) {
    await Usuario.create({
      nombre: 'Test',
      email: 'santytorres879@gmail.com',
      password: 'Test1234*',
      type: 'Usuario' // <- MUY IMPORTANTE
    });
  }
});


describe('Recuperar contraseña', () => {
  test('POST /api/recuperar_password', async () => {
    const response = await request(app)
      .post('/api/recuperar_password')
      .send({ email: 'santytorres879@gmail.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
  });
});
