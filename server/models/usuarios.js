//importacion de mongoose para manejar la base de datos MongoDB
import mongoose from "mongoose";

//Definicion del esquema de usuario
const UsuarioSchema = new mongoose.Schema({

    //Nombre de usuario obligatorio
    nombre: {
        type: String,
        required: true,
    },
    //correo electrónico obligatorio, debe ser único
    email: {
        type: String,
        required: true,
        unique: true,
    },
    //Contraseña obligatoria
    password: {
        type: String,
        required: true,
    },
    //Tipo de usuario, puede ser Usuario o Empresa
    type: {
        type: String,
        enum: ["Usuario", "Empresa"],
        required: true,
    },
    //Indica si el correo electrónico ha sido verificado
    verified: {
        type: Boolean,
        default: false
    },
    //Verification token para la verificación del correo electrónico
    verificationToken: {
       type: String,
    },
    //Token temporal para restablecer la contraseña
    resetPasswordToken: {
       type: String,
    },
    //Fecha de expiración del token de restablecimiento de contraseña
    resetPasswordExpires: {
       type: String,
    },
});

//Modelo del esquema
const Usuario = mongoose.model("Usuario", UsuarioSchema);
//Exporta el modelo para usarlo en otros archivos
export default Usuario;