import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Usuario from '../../server/models/usuarios.js';

dotenv.config();

describe('Validación de cuenta', () => {
  let tokenPrueba = 'token_de_prueba_123';
  const emailPrueba = 'usuario_verificar@example.com';

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Crea un usuario con token de verificación
    const nuevoUsuario = new Usuario({
      nombre: 'Prueba Verificación',
      email: emailPrueba,
      password: 'contrasena123',
      type: 'Usuario',
      verificationToken: tokenPrueba,
      verified: false
    });

    await nuevoUsuario.save();
  });

  afterAll(async () => {
    await Usuario.deleteOne({ email: emailPrueba });
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  test('GET /api/validacion/:token debería redirigir al login y marcar como verificado', async () => {
    const response = await request(app).get(`/api/validacion/${tokenPrueba}`);

    expect(response.statusCode).toBe(302); // Redirección
    expect(response.header.location).toBe('http://localhost:5173/login'); // Verifica redirección

    // Verifica que el usuario está marcado como verificado
    const usuarioVerificado = await Usuario.findOne({ email: emailPrueba });
    expect(usuarioVerificado.verified).toBe(true);
    expect(usuarioVerificado.verificationToken).toBeUndefined();
  });
});
