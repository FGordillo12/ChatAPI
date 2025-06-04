const request = require('supertest');
const app = require('../../app');

describe('Reporte de mensajes', () => {
  test('GET /reportes/:usuario1/:usuario2', async () => {
    const response = await request(app)
      .get('/reportes/userA/userB');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('reporte');
  });
});
