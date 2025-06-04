import request from 'supertest';
import app from '../app.js';

// Importar jest desde globals (¡requerido para ES modules!)
import { jest } from '@jest/globals';

// Mocks
import nodemailer from 'nodemailer';
jest.mock('nodemailer');

import Usuario from '../server/models/usuarios.js';
jest.mock('../server/models/usuarios.js');

describe('POST /recuperar_password', () => {
  let sendMailMock;

  beforeEach(() => {
    // Mock del transporte de nodemailer
    sendMailMock = jest.fn().mockResolvedValue(true);
    nodemailer.createTransport.mockReturnValue({
      sendMail: sendMailMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver 200 si el correo es válido', async () => {
    const mockSave = jest.fn().mockResolvedValue(true);

    Usuario.findOne.mockResolvedValue({
      email: 'usuario@ejemplo.com',
      save: mockSave,
    });

    const response = await request(app)
      .post('/recuperar_password')
      .send({ email: 'santytorres879@gmail.com' });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toMatch(/recuperación/i);
    expect(sendMailMock).toHaveBeenCalled();
    expect(mockSave).toHaveBeenCalled();
  });

  it('debería devolver 404 si el correo no está registrado', async () => {
    Usuario.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/recuperar_password')
      .send({ email: 'noexiste@correo.com' });

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toMatch(/no encontrado/i);
  });

  it('debería devolver 500 si ocurre un error en el servidor', async () => {
    Usuario.findOne.mockRejectedValue(new Error('Error de base de datos'));

    const response = await request(app)
      .post('/recuperar_password')
      .send({ email: 'usuario@ejemplo.com' });

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toMatch(/error/i);
  });
});
