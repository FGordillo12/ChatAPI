import supertest from 'supertest';
import { app } from '../app.js'; // Ajusta el path según tu estructura

describe('Pruebas sobre la API/Registro', () => {
  it('Prueba de Registro', async () => {
    const metodoPOST = {
      nombre: "Prueba Uno",
      email: "pruebauno@gmail.com",
      password: "Hola12345*",
      type: "Usuario"
    };

    const response = await supertest(app).post('/api/registro').send(metodoPOST);
    expect(response.status).toBe(201);
    console.log('RESPUESTA DEL SERVIDOR:', response.body);
  }, 15000);

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