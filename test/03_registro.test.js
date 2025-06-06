import 'dotenv/config';
import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app.js'; // Ajusta el path según tu estructura

describe('Conexion a la base de datos', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('debe conectar a la base de datos sin errores', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = conectado
  });
});

describe('Pruebas sobre la API/Registro', () => {
  beforeAll(async () => {
    // Aseguramos la conexión antes de estas pruebas
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
    }
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

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
  }, 15000);
});
