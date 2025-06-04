const request = require('supertest');
const app = require('../../app');

describe('Eliminar mensaje', () => {
  test('DELETE /mensajes/:id', async () => {
    const response = await request(app).delete('/mensajes/12345');

    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBe(true);
  });
});
