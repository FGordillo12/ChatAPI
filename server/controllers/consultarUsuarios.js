import Usuario from "../models/usuarios.js";

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
     let arregloUsuarios = []
    if (usuarios) {
      usuarios.forEach((user)  =>{
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
    res.status(200).json({
        usuarios: arregloUsuarios
      })

  } catch(err){
     res.status(500).json({ message: err.message });
  }
  
}

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
    res.status(200).json({
        empresas: arregloEmpresa
      })

  } catch(err){
     res.status(500).json({ message: err.message });
  }
  

}