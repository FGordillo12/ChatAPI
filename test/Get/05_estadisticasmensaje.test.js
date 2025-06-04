const request = require('supertest');
const app = require('../../app');

describe('Estadísticas de mensajes', () => {
  test('GET /estadisticas/:usuario1/:usuario2', async () => {
    const response = await request(app)
      .get('/estadisticas/userA/userB');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('totalMensajes');
  });
});
