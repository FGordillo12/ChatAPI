import 'dotenv/config';
import mongoose from 'mongoose';

describe('Conexion a la base de datos', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it('debe conectar a la base de datos sin errores', async () => {
    while (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    expect(mongoose.connection.readyState).toBe(1);
  });
});
