import request from 'supertest';
import app from '../../app.js';

describe('Eliminar mensaje', () => {
  test('DELETE /mensajes/:id', async () => {
    const response = await request(app).delete('/api/mensajes/12345');

    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBe(true);
    expect(response.body.id).toBe('12345');
  });
});
// 