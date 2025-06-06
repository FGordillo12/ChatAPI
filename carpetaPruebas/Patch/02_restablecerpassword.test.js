import request from 'supertest';
import app from '../../app.js';
import Usuario from '../../server/models/usuarios.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

describe('Restablecer contraseña', () => {
  let resetToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS); // Ajusta según tu config

    // Crear usuario con token para el test
    const usuario = new Usuario({
      nombre: 'Test User',
      email: 'testuser@example.com',
      password: 'oldpassword',
      type: 'Usuario',
      resetPasswordToken: 'token123',
      resetPasswordExpires: Date.now() + 3600000 // 1 hora desde ahora
    });
    await usuario.save();

    resetToken = usuario.resetPasswordToken;
  });

  afterAll(async () => {
    await Usuario.deleteOne({ email: 'testuser@example.com' });
    await mongoose.connection.close();
  });

  test('PATCH /api/restablecer_password/:token debe restablecer la contraseña', async () => {
    const response = await request(app)
      .patch(`/api/restablecer_password/${resetToken}`)
      .send({ password: 'NuevaPass123' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Contraseña restablecida correctamente.');
  });
});
