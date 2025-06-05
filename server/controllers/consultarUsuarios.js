//Importamos el modelo de Usuario
import Usuario from "../models/usuarios.js";

//Funciones para consultar los usuarios y las empresas
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find(); //Se busca todos los usuarios en la base de datos
     let arregloUsuarios = [] //creacion de arreglo para almacenar los usuarios
    if (usuarios) {
      usuarios.forEach((user)  =>{
        //Arreglo de usuarios que no sean tipo empresas
        if(user.type!== 'Empresa'){
          arregloUsuarios.push(
            {
            id: user._id,
            nombre:user.nombre,
            email: user.email

          });
        }
      });
    }
    //Se envia la lista de usuarios 
    res.status(200).json({
        usuarios: arregloUsuarios
      })
    //Si no se encuentra ningun usuario, se envia un mensaje de error
  } catch(err){
     res.status(500).json({ message: err.message });
  }
  
}
//Funcion para consultar todas las empresas
export const getEmpresas = async (req, res) => {
  try {
    const empresas = await Usuario.find();
     let arregloEmpresa = []
    if (empresas) {
      empresas.forEach((empresa)  =>{
        if(empresa.type !== 'Usuario'){
          arregloEmpresa.push(
            {
            id: empresa._id,
            nombre: empresa.nombre,
            email: empresa.email

          });
        }
      });
    }
    //Se envia la lista de empresas
    res.status(200).json({
        empresas: arregloEmpresa
      })

    //Si no se encuentra ninguna empresa, se envia un mensaje de error
  } catch(err){
     res.status(500).json({ message: err.message });
  }
  

}