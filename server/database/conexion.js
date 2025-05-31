import mongoose from "mongoose";

const connectionDb = async () => {
  const conexion = process.env.CONNECTION_STRING2; 
  try {
    const connectDb = await mongoose.connect(conexion);
    console.log(
      'Connection established:',
      connectDb.connection.name,
      connectDb.connection.host
    );
  } catch (err) {
    console.log('Fallo en la conexion: ' + err);
  }
};

export default connectionDb;