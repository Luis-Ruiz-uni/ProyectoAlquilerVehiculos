class AuthUI {
  constructor(usuarioManager) {
    this.usuarioManager = usuarioManager;
    // Seleccionar elementos del DOM necesarios para el Login
    this.modalLogin = document.getElementById('modal-login');
    this.formLogin = document.getElementById('form-login');
    this.inputUsername = document.getElementById('login-username');
    this.inputPassword = document.getElementById('login-password');
    this.userDisplay = document.getElementById('user-display');
    this.btnLogin = document.getElementById('btn-login');

    this.initEvents();
    this.renderEstadoSesion();
  }

  // Registra los event listeners para el login/logout
  initEvents() {
    if(this.formLogin){
      this.formLogin.addEventListener('submit', (e) => this.handleLogin(e));
    }
    if(this.btnLogin){
      this.btnLogin.addEventListener('click', () => {
        const usuarioActivo = this.usuarioManager.obtenerUsuarioSesion();
        if(usuarioActivo){
          this.handleLogout();
        }else{
          this.toggleModalLogin(true);
        }
      })
    }
  }

  // Procesa el submit del formulario de login
  handleLogin(event) {
    event.preventDefault();
    const username = this.inputUsername.value.trim();
    const password = this.inputPassword.value.trim();
    if(!username || !password){
      alert("Complete todos los campos");
      return;
    } 
    const usuarioValido = this.usuarioManager.autenticar(username, password);
    if(usuarioValido){
      this.renderEstadoSesion();
      this.toggleModalLogin(false);
      this.formLogin.reset();
      alert(`Bienvenido ${usuarioValido.nombre}`);
    }else{
      alert('Usuario o contraseña incorrectos');
    }
  }

  // Procesa el cierre de sesión del usuario
  handleLogout() {
    if(confirm('¿Esta seguro de cerrar la sesion actual')){
      this.usuarioManager.cerrarSesion();
      this.renderEstadoSesion();
      alert('Sesión cerrada');
    }
  }

  // Actualiza el nombre del usuario en el navbar según el estado de sesión
  renderEstadoSesion() {
    const usuarioActivo = this.usuarioManager.obtenerUsuarioSesion();
    if(usuarioActivo){
      this.userDisplay.textContent = `${usuarioActivo.nombre}`;
      this.btnLogin.textContent = 'Cerrar Sesión';
      this.btnLogin.classList.replace('btn-secondary', 'btn-danger');
    }else{
      this.userDisplay.textContent = 'Invitado';
      this.btnLogin.textContent = 'Iniciar Sesión';
      this.btnLogin.classList.replace('btn-danger', 'btn-secondary');
    }
  }

  // Muestra u oculta el modal/vista de Login
  toggleModalLogin(visible) {
    if(this.modalLogin){
      this.modalLogin.style.display = visible ? 'flex' : 'none';
    }
  }
}