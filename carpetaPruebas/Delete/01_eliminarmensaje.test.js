import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../../app.js';
import Mensaje from '../../server/models/mensajes.js';

dotenv.config();

describe('Eliminar mensaje', () => {
  let mensajeId;

  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);

    // Crear mensaje de prueba
    const mensajePrueba = new Mensaje({
      remitente: 'userA',
      destinatario: 'userB',
      mensaje: 'Mensaje para eliminar',
      timestamp: new Date(),
    });
    const savedMensaje = await mensajePrueba.save();
    mensajeId = savedMensaje._id.toString();
  });

  afterAll(async () => {
    // Por si acaso el mensaje no fue eliminado, intentamos borrarlo
    try {
      await Mensaje.deleteOne({ _id: mensajeId });
    } catch (error) {
      console.warn('No se pudo eliminar el mensaje de prueba:', error);
    }
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(resolve, 0)); // evitar hangs en Jest
  });

  test('DELETE /api/mensajes/:id debe eliminar el mensaje', async () => {
    const response = await request(app).delete(`/api/mensajes/${mensajeId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.deleted).toBe(true);
    expect(response.body.id).toBe(mensajeId);

    // Verificar que ya no existe en BD
    const mensajeDB = await Mensaje.findById(mensajeId);
    expect(mensajeDB).toBeNull();
  });
});
