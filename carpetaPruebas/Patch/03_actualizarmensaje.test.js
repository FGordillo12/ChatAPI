import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Mensaje from '../../server/models/mensajes.js';

dotenv.config();

describe('Actualizar mensaje', () => {
  let mensajeId;

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Crear mensaje de prueba
    const mensajePrueba = new Mensaje({
      remitente: 'userA',
      destinatario: 'userB',
      mensaje: 'Mensaje original',
      timestamp: new Date(),
    });
    const savedMensaje = await mensajePrueba.save();
    mensajeId = savedMensaje._id.toString();
  });

  afterAll(async () => {
    try {
      await Mensaje.deleteOne({ _id: mensajeId });
    } catch (error) {
      console.warn('No se pudo eliminar el mensaje de prueba:', error);
    }
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0)); // evitar hangs en Jest
  });

  test('PATCH /api/mensajes/:id debe actualizar el contenido del mensaje', async () => {
    const nuevoTexto = 'Mensaje actualizado';

    const response = await request(app)
      .patch(`/api/mensajes/${mensajeId}`)
      .send({ mensaje: nuevoTexto });

    expect(response.statusCode).toBe(200);
    expect(response.body.mensaje).toBeDefined();
    expect(response.body.mensaje.mensaje).toBe(nuevoTexto);
    expect(response.body.mensaje._id).toBe(mensajeId);
  });
});
