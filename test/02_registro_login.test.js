import 'dotenv/config';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Usuario from '../server/models/usuarios.js';

describe('Tests completos API y base de datos', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('Conexión a la base de datos', () => {
    it('Debe conectar sin errores', () => {
      expect(mongoose.connection.readyState).toBe(1);
    });
  });

  describe('API /registro', () => {
    it('Debe registrar un usuario nuevo', async () => {
      const metodoPOST = {
        nombre: "Prueba Uno",
        email: "pruebauno@gmail.com",
        password: "Hola12345*",
        type: "Usuario"
      };

      const response = await supertest(app).post('/api/registro').send(metodoPOST);
      expect(response.status).toBe(201);
    });

    it('No debe registrar usuario con email ya existente', async () => {
      const response = await supertest(app).post('/api/registro').send({
        nombre: "Prueba Uno",
        email: "pruebauno@gmail.com",
        password: "Hola12345*",
        type: "Usuario"
      });
      expect(response.status).toBe(409);
    });
  });

  describe('API /login', () => {
    beforeAll(async () => {
      // Crear usuario para login y marcarlo como verificado
      await supertest(app).post('/api/registro').send({
        nombre: "Prueba Login",
        email: "usg200208@gmail.com",
        password: "Hola12345*",
        type: "Usuario",
        verified: true
      });
      await Usuario.updateOne({ email: "usg200208@gmail.com" }, { verified: true });
    });

    it('Debe iniciar sesión correctamente', async () => {
      const response = await supertest(app).post('/api/login').send({
        email: "usg200208@gmail.com",
        password: "Hola12345*"
      });
      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('No debe iniciar sesión con contraseña incorrecta', async () => {
      const response = await supertest(app).post('/api/login').send({
        email: "usg200208@gmail.com",
        password: "ContraseñaMala123"
      });
      expect(response.status).toBe(401);
    });
  });
});
