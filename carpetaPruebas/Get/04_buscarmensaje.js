const request = require('supertest');
const app = require('../../app.js');

describe('Mensajes entre usuarios', () => {
  test('GET /mensajes/:usuario1/:usuario2', async () => {
    const response = await request(app)
      .get('/mensajes/userA/userB');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
