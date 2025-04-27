

import Usuario from '../models/usuarios.js'; 

const registrarusuario = async (req, res) => {
  try {
    const { nombreCompleto, email, password, type } = req.body;

    const nuevoRegistro = new Usuario({
      nombreCompleto,
      email,
      password,
      type
    });

    await nuevoRegistro.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

export { registrarusuario };

