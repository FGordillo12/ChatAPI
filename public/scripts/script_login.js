const botonRegistro = document.getElementById('boton-ventana-registro');
const botonInicioSesion = document.getElementById('boton-inicio-sesion');
const emailInput = document.getElementById('email_login');
const passwordInput = document.getElementById('password_login');
const errorLogin = document.getElementsById('error-login');
const type = document.querySelector('input[name="type"]:checked')?.value;


botonRegistro.addEventListener('click',(e) =>{
  e.preventDefault();
  window.location.href = '/';
})

botonInicioSesion.addEventListener('click', async (event) => {
  event.preventDefault(); 

  const email_login = emailInput.value;
  const password_login = passwordInput.value;

  try {
      const response = await fetch('/api/usuarios/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email_login, password_login }) 
      });

      const data = await response.json();

      if (response.ok) {
          alert(data.message);
          console.log('Usuario logueado:', data.usuario);
          window.location.href = '/main'; 
      } else {
          errorLogin.textContent = data.message;
      }
  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      errorLogin.textContent = 'Error en el servidor, intenta más tarde.';
  }
});

