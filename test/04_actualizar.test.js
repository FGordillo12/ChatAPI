import supertest from 'supertest';
import { app } from '..';

describe('Pruebas sobre la api/perfil', () => {
  let cookies = [];

  beforeAll(async () => {
    // Registro del usuario
    await supertest(app).post('/api/registro').send({
      nombre: "Prueba Uno",
      email: "pruebauno@gmail.com",
      password: "Hola12345*",
      type: "Usuario"
    });

    // Inicio de sesión y almacenamiento de cookies
    const loginResponse = await supertest(app).post('/api/login').send({
      email: "pruebauno@gmail.com",
      password: "Hola12345*"
    });

    cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();
  });

  describe('PATCH /api/perfil', () => {
    it('Prueba de Actualizar Usuario con cookie de sesión', async () => {
      const metodoPATCH = {
        nombre: "Usuario Prueba",
        email: "pruebauno@gmail.com"
      };

      const response = await supertest(app)
        .patch('/api/perfil')
        .set('Cookie', cookies) // 👈 Importante: adjuntar cookie
        .send(metodoPATCH);

      expect(response.status).toBe(200);
    });
  });
});
