import supertest from 'supertest';
import { app } from '..';

describe('Pruebas sobre la API', () => {
  describe('POST /api/registro', () => {

    it('Prueba de Registro', async () => {

      const metodoPOST =
      {
        nombreCompleto: "Prueba Uno",
        email: "pruebauno@gmail.com",
        password: "Hola12345*",
        type: "Usuario"
      }

      const response = await supertest(app).post('/api/registro').send(metodoPOST)
      expect(response.status).toBe(201);
      console.log('RESPUESTA DEL SERVIDOR:', response.body);

    })
  })

  describe('POST/api/login', () => {
    it('Prueba de Inicio de Sesion', async () => {
      const metodoPOST =
      {
        email: "pruebauno@gmail.com",
        password: "Hola12345*"
      };
      const response = await supertest(app).post('/api/login').send(metodoPOST);
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  })

   
     it('No debe registrar usuario con email ya existente', async () => {
    const response = await supertest(app).post('/api/registro').send({
      nombreCompleto: "Prueba Uno",
      email: "pruebauno@gmail.com", // mismo email
      password: "Hola12345*",
      type: "Usuario"
    });
    expect(response.status).toBe(409); // o 400 dependiendo de tu lógica
  });

  it('No debe iniciar sesión con contraseña incorrecta', async () => {
    const response = await supertest(app).post('/api/login').send({
      email: "pruebauno@gmail.com",
      password: "ContraseñaMala123"
    });
    expect(response.status).toBe(401); // o el código que uses para autenticación fallida
  });


});
