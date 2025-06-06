// test/Get/03_empresas.test.js
import request from 'supertest';
import app from '../../app.js'; // asegúrate de que el archivo tenga extensión .js

describe('Empresas', () => {
  test('GET /empresas', async () => {
    const response = await request(app).get('/empresas');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
