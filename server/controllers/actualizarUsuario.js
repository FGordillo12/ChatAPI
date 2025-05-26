import Usuario from '../models/usuarios.js';

export const actualizarUsuario = async (req, res) => {
  const userId = req.usuario.id; 
  const { nombreCompleto, email } = req.body;

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      userId,
      { nombreCompleto, email },
      { new: true } 
    );

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', usuario: usuarioActualizado });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

