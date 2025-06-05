//Importacion de mongoose para definir el esquema de mensajes
import mongoose from "mongoose";

//Definicion del esquema de mensajes del chat
const mensajeSchema = new mongoose.Schema({
  //Id del remitente y destinatario, ambos obligatorios
  remitente: {
    type: String,
    required: true
  },
  destinatario: {
    type: String,
    required: true
  //Contenido del mensaje, puede ser texto o un archivo
  },
  mensaje: {
    type: String  
  },
  //Id unico del mensaje, no es obligatorio
  id: {
    type: String,
    required: false
  },
  //Campo para adjuntar un archivo al mensaje
  archivo: {
    datos: {
      type: Buffer //Muy importante para guardar binarios
    },
    tipo: {
      type: String //Tipo MIME del archivo 
    },
    nombre: {
      type: String //Nombre del archivo
    }
  },
  //Fecha y hora del mensaje, obligatorio
  timestamp: {
    type: Date,
    required: true
  },
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema); //Modelo del esquema de mensajes
export default Mensaje; //Exporta el modelo para usarlo en otros archivos