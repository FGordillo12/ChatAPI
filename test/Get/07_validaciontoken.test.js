const request = require('supertest');
const app = require('../../app');

describe('Validación de token', () => {
  test('GET /validacion/:token', async () => {
    const response = await request(app)
      .get('/validacion/token123');

    expect(response.statusCode).toBe(200);
    expect(response.body.validado).toBe(true);
  });
});
