class ClienteManager {
  constructor() {
    this.key = 'clientes';
    this.clientes = this.cargarDesdeStorage();
  }

  cargarDesdeStorage() {
    return StorageManager.obtener(this.key);
  }

  guardarEnStorage() {
    StorageManager.guardar(this.key, this.clientes);
  }

  obtenerTodos() {
    return this.clientes;
  }

  obtenerPorId(id) {
    return this.clientes.find(c => Number(c.id) === Number(id));
  }

  agregar(clienteData) {
    const idCliente = IdManager.obtenerSiguienteId(this.key);

    const nuevoCliente = {
      id: idCliente,
      ...clienteData
    };
    this.clientes.push(nuevoCliente);
    this.guardarEnStorage();
    return nuevoCliente;
  }
}