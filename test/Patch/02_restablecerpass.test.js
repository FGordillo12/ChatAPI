import supertest from 'supertest';
import { app } from './index.js';

describe('Restablecer contraseña', () => {
  test('PATCH /restablecer_password/:token', async () => {
    const response = await request(app)
      .patch('/restablecer_password/token123')
      .send({ nuevaPassword: 'NuevaPass123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
