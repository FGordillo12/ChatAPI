import mongoose from 'mongoose';
import 'dotenv/config';

beforeAll(async () => {
  await mongoose.connect(process.env.CONNECTION_STRING_PRUEBAS);
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
});