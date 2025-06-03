import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  remitente: {
    type: String,
    required: true
  },
  destinatario: {
    type: String,
    required: true
  },
  mensaje: {
    type: String  
  },
  timestamp: {
    type: Date,
    required: true
  },
  id: {
    type: String,
    required: false
  },
  archivo: {
    datos: {
      type: Buffer // 👈 Muy importante para guardar binarios
    },
    tipo: {
      type: String
    },
    nombre: {
      type: String
    }
  }
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema);
export default Mensaje;