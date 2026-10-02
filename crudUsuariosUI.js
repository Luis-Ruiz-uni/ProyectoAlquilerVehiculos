class CRUDUsuariosUI {
  constructor(usuarioManager) {
    this.usuarioManager = usuarioManager;
    // Elementos del DOM
    this.formUsuario = document.getElementById('form-usuario');
    this.inputUsername = document.getElementById('usuario-username');
    this.inputPassword = document.getElementById('usuario-password');
    this.inputNombre = document.getElementById('usuario-nombre');
    this.tablaUsuarios = document.getElementById('tabla-usuarios')

    this.initEvents();
  }

  // Registra eventos de creación y edición de usuarios
  initEvents() {
    if (this.formUsuario) {
      this.formUsuario.addEventListener('submit', (e) => this.handleGuardarUsuario(e));
    }
  }

  // Captura los datos del formulario de alta de usuario
  handleGuardarUsuario(event) {
    event.preventDefault();

    const usuarioData = {
      username: this.inputUsername.value.trim(),
      password: this.inputPassword.value.trim(),
      nombre: this.inputNombre.value.trim()
    };

    if (!usuarioData.username || !usuarioData.password) {
      alert('Por favor complete todos los campos requeridos.');
      return;
    }

    this.usuarioManager.agregar(usuarioData);
    alert('Usuario operador registrado correctamente.');

    this.formUsuario.reset();
    this.renderTablaUsuarios();
  }

  // Renderiza la tabla con los usuarios del sistema
  renderTablaUsuarios() {if (!this.tablaUsuarios) return;

    const usuarios = this.usuarioManager.obtenerTodos();

    if (usuarios.length === 0) {
      this.tablaUsuarios.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 1rem;">
            No hay usuarios registrados.
          </td>
        </tr>
      `;
      return;
    }

    this.tablaUsuarios.innerHTML = usuarios.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.nombre}</td>
        <td><strong>${u.username}</strong></td>
        <td>••••••••</td>
      </tr>
    `).join('');}
}