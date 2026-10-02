class UsuarioManager {
  constructor() {
    this.key = 'usuarios';
    this.sessionKey = 'usuario_activo';
    this.usuarios = this.cargarDesdeStorage();
    this.inicializarUsuarioAdmin();
  }

  cargarDesdeStorage() {
    return StorageManager.obtener(this.key);
  }

  guardarEnStorage() {
    StorageManager.guardar(this.key, this.usuarios);
  }

  // Crea un usuario por defecto si la base de datos local está vacía
  inicializarUsuarioAdmin() {
    if (this.usuarios.length === 0) {
      this.agregar({ username: 'admin', password: '123', nombre: 'Administrador' });
    }
  }

  obtenerTodos() {
    return this.usuarios;
  }

  agregar(usuarioData) {
    const idUsuario = IdManager.obtenerSiguienteId(this.key);
    const nuevoUsuario = {
      id: idUsuario,
      ...usuarioData
    };
    this.usuarios.push(nuevoUsuario);
    this.guardarEnStorage();
    return nuevoUsuario;
  }

  // Autenticación de credenciales (Login)
  autenticar(username, password) {
    const usuario = this.usuarios.find(
      u => u.username === username && u.password === password
    );
    if (usuario) {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(usuario));
      return usuario;
    }
    return null;
  }

  obtenerUsuarioSesion() {
    const data = sessionStorage.getItem(this.sessionKey);
    return data ? JSON.parse(data) : null;
  }

  cerrarSesion() {
    sessionStorage.removeItem(this.sessionKey);
  }
}