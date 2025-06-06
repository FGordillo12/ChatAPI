import 'dotenv/config';
import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import Usuario from '../server/models/usuarios.js';

let cookies = [];

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
      // Registrar usuario para login
      await supertest(app).post('/api/registro').send({
        nombre: "Prueba Login",
        email: "usg200208@gmail.com",
        password: "Hola12345*",
        type: "Usuario"
      });

      // Marcar usuario como verificado
      await Usuario.updateOne({ email: "usg200208@gmail.com" }, { verified: true });

      // Login y captura cookies
      const response = await supertest(app).post('/api/login').send({
        email: "usg200208@gmail.com",
        password: "Hola12345*"
      });

      cookies = response.headers['set-cookie'];
      if (!cookies) {
        throw new Error('No se recibió cookie en login');
      }
    });

    it('Debe iniciar sesión correctamente', () => {
      expect(cookies).toBeDefined();
      expect(cookies.length).toBeGreaterThan(0);
    });

    it('No debe iniciar sesión con contraseña incorrecta', async () => {
      const response = await supertest(app).post('/api/login').send({
        email: "usg200208@gmail.com",
        password: "ContraseñaMala123"
      });
      expect(response.status).toBe(401);
    });
  });

  describe('API /perfil', () => {
    it('Debe actualizar perfil con sesión válida', async () => {
      const res = await supertest(app)
        .patch('/api/perfil')
        .set('Cookie', cookies) // cookies validas para autenticacion
        .send({ nombre: "Nuevo Nombre", email: "usg200208@gmail.com" });

      expect(res.status).toBe(200);
    });

    it('Debe fallar si no hay cookie de sesión', async () => {
      const res = await supertest(app)
        .patch('/api/perfil')
        .send({ nombre: "Sin token", email: "pruebasperfil@gmail.com" });

      expect(res.status).toBe(401);
    });
  });
});
