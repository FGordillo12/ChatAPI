import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema({

    nombre: {
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
        enum: ["Usuario", "Empresa"],
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
       type: String,
    },
    resetPasswordToken: {
       type: String,
    },
    resetPasswordExpires: {
       type: String,
    },
});

//Modelo del esquema
const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;