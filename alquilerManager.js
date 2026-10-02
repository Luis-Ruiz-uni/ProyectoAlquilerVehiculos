class AlquilerManager {
  constructor(vehiculoManager) {
    this.key = 'alquileres';
    this.vehiculoManager = vehiculoManager;
    this.alquileres = this.cargarDesdeStorage();
  }

  cargarDesdeStorage() {
    return StorageManager.obtener(this.key);
  }

  guardarEnStorage() {
    StorageManager.guardar(this.key, this.alquileres);
  }

  obtenerTodos() {
    return this.alquileres;
  }

  crearAlquiler({ vehiculoId, clienteId, usuarioId, fechaInicio, fechaFinEstimada }) {
    const vehiculo = this.vehiculoManager.obtenerPorId(vehiculoId);
    if (!vehiculo || !vehiculo.disponible) {
      throw new Error('El vehículo no está disponible para alquiler.');
    }

    const costoTotal = AlquilerManager.calcularCostoTotal(
      fechaInicio,
      fechaFinEstimada,
      vehiculo.costoPorDia
    );

    const idAlquiler = IdManager.obtenerSiguienteId(this.key);
    const nuevoAlquiler = {
      id: idAlquiler,
      vehiculoId,
      clienteId,
      usuarioId,
      fechaInicio,             // Formato string "YYYY-MM-DD"
      fechaFinEstimada,        // Formato string "YYYY-MM-DD"
      fechaDevolucionReal: null,
      costoTotal,
      estado: 'ACTIVO'
    };

    this.alquileres.push(nuevoAlquiler);
    this.guardarEnStorage();

    // Actualizar estado del vehículo a no disponible
    this.vehiculoManager.actualizarEstado(vehiculoId, false);

    return nuevoAlquiler;
  }

  registrarDevolucion(alquilerId, fechaDevolucionReal) {
    const alquiler = this.alquileres.find(a => a.id === alquilerId);
    if (!alquiler) throw new Error('Alquiler no encontrado.');

    alquiler.fechaDevolucionReal = fechaDevolucionReal;
    alquiler.estado = 'DEVUELTO';
    this.guardarEnStorage();

    // Liberar el vehículo
    this.vehiculoManager.actualizarEstado(alquiler.vehiculoId, true);
    return alquiler;
  }

  // Informe 1: Vehículos prestados entre dos fechas
  obtenerPrestadosEntreFechas(fechaDesde, fechaHasta) {
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    return this.alquileres.filter(a => {
      const inicio = new Date(a.fechaInicio);
      return inicio >= desde && inicio <= hasta;
    });
  }

  // Informe 2: Clientes con préstamos vencidos
  obtenerClientesConPrestamosVencidos() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return this.alquileres.filter(a => {
      if (a.estado !== 'ACTIVO') return false;
      const finEstimado = new Date(a.fechaFinEstimada);
      return finEstimado < hoy;
    });
  }

  // Método estático auxiliar para calcular el costo
  static calcularCostoTotal(fechaInicioStr, fechaFinStr, costoPorDia) {
    const inicio = new Date(fechaInicioStr);
    const fin = new Date(fechaFinStr);

    // Diferencia en milisegundos convertida a días
    const diferenciaMS = fin.getTime() - inicio.getTime();
    let dias = Math.ceil(diferenciaMS / (1000 * 60 * 60 * 24));

    // Regla de negocio: Al menos se cobra 1 día de alquiler
    if (dias <= 0) dias = 1;

    return dias * costoPorDia;
  }
}