// test/Get/03_empresas.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Usuario from '../../server/models/usuarios.js';

dotenv.config();

describe('Empresas', () => {
  const emailPrueba = 'empresa_test@example.com';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Insertar una empresa de prueba (type distinto de 'Usuario')
    const nuevaEmpresa = new Usuario({
      nombre: 'Empresa de Prueba',
      email: emailPrueba,
      password: 'contrasena123',
      type: 'Empresa',
    });

    await nuevaEmpresa.save();
  });

  afterAll(async () => {
    // Eliminar la empresa de prueba
    await Usuario.deleteOne({ email: emailPrueba });
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0)); // evitar que Jest se quede colgado
  });

  test('GET /api/empresas debería devolver un arreglo de empresas no usuario', async () => {
    const response = await request(app).get('/api/empresas');

    expect(response.statusCode).toBe(200);

    // Según tu controlador, envía un objeto con la propiedad "empresas"
    expect(Array.isArray(response.body.empresas)).toBe(true);

    // Verifica que la empresa de prueba esté incluida
    const encontrada = response.body.empresas.find(e => e.email === emailPrueba);
    expect(encontrada).toBeDefined();
    expect(encontrada.nombre).toBe('Empresa de Prueba');
  });
});

