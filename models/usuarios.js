import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({
    nombreCompleto: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum:["Usuario", "Empresa"],
        required: true,
    },
    });

    //Modelo del esquema
const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;