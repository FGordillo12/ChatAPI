import mongoose from "mongoose";

const connectionDb = async () => {
        const conexion = "mongodb+srv://SanCode:FOpldaLQgqNTxhYh@cluster0.tsmwijl.mongodb.net/sistema_chatapi?retryWrites=true&w=majority&appName=Cluster0"
  try {

    const connectDb = await mongoose.connect(conexion);
    console.log(
      'Connection established',
      connectDb.connection.name,
      connectDb.connection.host);
  } catch (err) {
    console.log('Fallo en la conexion: ' + err);
  };
};
export default connectionDb;
connectionDb();