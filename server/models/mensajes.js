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
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  id: {
    type: String,
    required: false
  },
});

const Mensaje = mongoose.model("Mensaje", mensajeSchema);
export default Mensaje;