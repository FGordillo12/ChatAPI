const request = require('supertest');
const app = require('../../app');

describe('Empresas', () => {
  test('GET /empresas', async () => {
    const response = await request(app).get('/empresas');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
