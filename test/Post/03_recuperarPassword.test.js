import supertest from 'supertest';
import { app } from './index.js';

describe('Recuperar contraseña', () => {
  test('POST /recuperar_password', async () => {
    const response = await request(app)
      .post('/recuperar_password')
      .send({ email: 'test@correo.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBeDefined();
  });
});

