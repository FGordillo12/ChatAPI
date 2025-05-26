import supertest from 'supertest';
import { app } from '..';

describe('Pruebas sobre la api/login', () => {
   
  beforeAll(async () => {
    // Intenta crear el usuario antes de la prueba de login
    await supertest(app).post('/api/registro').send({
      nombre: "Prueba Uno",
      email: "pruebauno@gmail.com",
      password: "Hola12345*",
      type: "Usuario"
    });
  });

  describe('POST/api/login', () => {
    it('Prueba de Inicio de Sesion', async () => {
      const metodoPOST = {
        email: "pruebauno@gmail.com",
        password: "Hola12345*"
      };

      const response = await supertest(app).post('/api/login').send(metodoPOST);
      console.log(response.headers['set-cookie']); 

      expect(response.status).toBe(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
    });
  });


  describe('POST/api/login', () => {
    it('No debe iniciar sesión con contraseña incorrecta', async () => {
      const response = await supertest(app).post('/api/login').send({
        email: "pruebauno@gmail.com",
        password: "ContraseñaMala123"
      });
      expect(response.status).toBe(401); // o el código que uses para autenticación fallida
    });
  })


})