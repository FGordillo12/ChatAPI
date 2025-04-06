const botonLogin = document.getElementById('boton-ventana-inicio');

botonLogin.addEventListener('click',(e) =>{
  e.preventDefault();
  window.location.href = '/login';
})