const request = require('supertest');
const app = require('../../app');

describe('Usuarios', () => {
  test('GET /usuarios', async () => {
    const response = await request(app).get('/usuarios');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
