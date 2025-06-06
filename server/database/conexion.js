// Importacion de mongoose para conectarse a la base de datos MongoDB
import mongoose from "mongoose";

const connectionDb = async () => { // Función para establecer la conexión a la base de datos MongoDB
  const conexion = process.env.CONNECTION_DATABASE_APP; 
  try { //intenta conectarse a la base de datos
    const connectDb = await mongoose.connect(conexion);
    console.log(
      'Connection established:', //conexion exitosa
      connectDb.connection.name, //nombre de la base de datos
      connectDb.connection.host //host de la base de datos
    );
  } catch (err) { //captura cualquier error al intentar conectarse
    console.log('Fallo en la conexion: ' + err); // muestra el error en caso de fallo
  }
};

export default connectionDb; //Exporta la funcion para ser utilizada en otros modulos