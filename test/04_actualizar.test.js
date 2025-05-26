import supertest from 'supertest';
import { app } from '..';
import Usuario from '../server/models/usuarios';

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
 await Usuario.updateOne({ email: "pruebauno@gmail.com" }, { verified: true });
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
  })
  describe('PATCH api/perfil', () =>{
     it('Debe fallar si no se envía la cookie', async () => {
      const response = await supertest(app)
        .patch('/api/perfil')
        .send({
          nombre: "Nombre sin token",
          email: "pruebauno@gmail.com"
        });

      expect(response.status).toBe(401); // Token no proporcionado
      expect(response.body.message).toBe("Token no proporcionado");
  })
  });
});
