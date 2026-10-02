class VehiculoManager {
  constructor() {
    this.key = 'vehiculos';
    this.vehiculos = this.cargarDesdeStorage();
  }

  cargarDesdeStorage() {
  this.vehiculos = StorageManager.obtener('vehiculos') || [];
  return this.vehiculos;
  }

  guardarEnStorage() {
    StorageManager.guardar(this.key, this.vehiculos);
  }

  obtenerTodos() {
    return this.vehiculos;
  }

  obtenerPorId(id) {
    return this.vehiculos.find(v => v.id === id);
  }

  agregar(vehiculoData) {
    const idVehiculo = IdManager.obtenerSiguienteId(this.key);
    const nuevoVehiculo = {
      id: idVehiculo,
      disponible: true,
      ...vehiculoData
    };
    this.vehiculos.push(nuevoVehiculo);
    this.guardarEnStorage();
    return nuevoVehiculo;
  }

  actualizarEstado(id, disponible) {
    const vehiculo = this.obtenerPorId(id);
    if (vehiculo) {
      vehiculo.disponible = disponible;
      this.guardarEnStorage();
    }
  }

  // Filtrado combinado para la pantalla principal
  filtrar({ marca = '', modelo = '', anio = '', disponibilidad = 'todos' }) {
    const lista = this.vehiculos || [];
    return this.vehiculos.filter(v => {
      const coincideMarca = v.marca.toLowerCase().includes(marca.toLowerCase().trim());
      const coincideModelo = v.modelo.toLowerCase().includes(modelo.toLowerCase().trim());
      const coincideAnio = !anio || v.anio.toString() === anio.toString();
      
      let coincideDisp = true;
      if (disponibilidad === 'disponible') coincideDisp = v.disponible === true;
      if (disponibilidad === 'alquilado') coincideDisp = v.disponible === false;

      return coincideMarca && coincideModelo && coincideAnio && coincideDisp;
    });
  }
}