import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Usuario from '../../server/models/usuarios.js';

dotenv.config();

describe('Usuarios', () => {
  const emailPrueba = 'usuario_test@example.com';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Insertar un usuario de prueba que NO sea empresa
    const nuevoUsuario = new Usuario({
      nombre: 'Usuario de Prueba',
      email: emailPrueba,
      password: 'contrasena123',
      type: 'Usuario',
    });

    await nuevoUsuario.save();
  });

  afterAll(async () => {
    // Eliminar el usuario de prueba
    await Usuario.deleteOne({ email: emailPrueba });
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0)); // para evitar que Jest se quede colgado
  });

  test('GET /api/usuarios debería devolver un arreglo de usuarios no empresa', async () => {
    const response = await request(app).get('/api/usuarios');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.usuarios)).toBe(true);

    // Verifica que el usuario de prueba esté incluido
    const encontrado = response.body.usuarios.find(u => u.email === emailPrueba);
    expect(encontrado).toBeDefined();
    expect(encontrado.nombre).toBe('Usuario de Prueba');
  });
});
