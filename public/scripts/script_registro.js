const botonLogin = document.getElementById('boton-ventana-inicio');
const formularioRegistro = document.querySelector('.input-registro'); //formulario de registro

botonLogin.addEventListener('click',(e) =>{
  e.preventDefault();
  window.location.href = '/login';
})

formularioRegistro.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita que recargue la página

  const nombreCompleto = document.getElementById('nombres-registro').value;
  const email = document.getElementById('email-registro').value;
  const password = document.getElementById('password-registro').value;
  const radios = document.getElementsByName('type');
  let type;
  for (const radio of radios) {
    if (radio.checked) {
      type = radio.value;
      break;
    }
  }

  try {
    const response = await fetch('/api/usuarios/registro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombreCompleto, email, password, type })
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);  //mensaje como alerta
      window.location.href = '/'; // Redirecciona a donde quieras (por ejemplo login)
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    errorRegistro.textContent = 'Error de servidor, inténtalo más tarde.';
  }
});