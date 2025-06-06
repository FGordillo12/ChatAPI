import supertest from 'supertest';
import { app } from './index.js';

describe('Actualizar mensaje', () => {
  test('PATCH /mensajes/:id', async () => {
    const response = await request(app)
      .patch('/mensajes/12345')
      .send({ leido: true });

    expect(response.statusCode).toBe(200);
    expect(response.body.updated).toBe(true);
  });
});
