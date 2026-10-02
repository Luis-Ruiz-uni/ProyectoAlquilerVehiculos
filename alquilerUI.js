class AlquilerUI {
  constructor(alquilerManager, vehiculoManager, clienteManager) {
    this.alquilerManager = alquilerManager;
    this.vehiculoManager = vehiculoManager;
    this.clienteManager = clienteManager;

    // Elementos del DOM
    this.formAlquiler = document.getElementById('form-alquiler');
    this.selectVehiculo = document.getElementById('select-vehiculo');
    this.selectCliente = document.getElementById('select-cliente');
    this.inputFechaInicio = document.getElementById('fecha-inicio');
    this.inputFechaFin = document.getElementById('fecha-fin');
    this.labelCostoTotal = document.getElementById('costo-total-preview');
    this.tablaAlquileresActivos = document.getElementById('tabla-alquileres-activos');

    this.initEvents();
  }

  // Registra los eventos del formulario y cambios en los selectores/fechas
  initEvents() {
    // 1. Evento submit del formulario para registrar alquiler
    if (this.formAlquiler) {
      this.formAlquiler.addEventListener('submit', (e) => this.handleCrearAlquiler(e));
    }

    // 2. Eventos para calcular el costo en tiempo real al cambiar vehículo o fechas
    const inputsCalculo = [this.selectVehiculo, this.inputFechaInicio, this.inputFechaFin];
    inputsCalculo.forEach(el => {
      if (el) {
        el.addEventListener('change', () => this.actualizarPrevisualizacionCosto());
        el.addEventListener('input', () => this.actualizarPrevisualizacionCosto());
      }
    });
  }

  // Puebla las opciones de los dropdowns (<select>) de clientes y vehículos disponibles
  cargarSelectores() {
    if (!this.selectVehiculo || !this.selectCliente) return;

    // 1. Poblar select de Vehículos Disponibles
    const vehiculosDisponibles = this.vehiculoManager.filtrar({ disponibilidad: 'disponible' });
    this.selectVehiculo.innerHTML = '<option value="">-- Seleccione un Vehículo --</option>' +
      vehiculosDisponibles.map(v => `
        <option value="${v.id}" data-costo="${v.costoPorDia}">
          ${v.marca} ${v.modelo} (${v.numeroChapa}) - $${Number(v.costoPorDia).toLocaleString()}/día
        </option>
      `).join('');

    // 2. Poblar select de Clientes
    const clientes = this.clienteManager.obtenerTodos();
    this.selectCliente.innerHTML = '<option value="">-- Seleccione un Cliente --</option>' +
      clientes.map(c => `
        <option value="${c.id}">${c.nombre} (Doc: ${c.documento})</option>
      `).join('');
  }

  // Escucha cambios en las fechas para calcular y mostrar la previsualización del costo total
  actualizarPrevisualizacionCosto() {
    if (!this.labelCostoTotal) return;

    const vehiculoId = this.selectVehiculo ? this.selectVehiculo.value : '';
    const fechaInicio = this.inputFechaInicio ? this.inputFechaInicio.value : '';
    const fechaFin = this.inputFechaFin ? this.inputFechaFin.value : '';

    // Si falta algún dato necesario, resetea el texto
    if (!vehiculoId || !fechaInicio || !fechaFin) {
      this.labelCostoTotal.textContent = '$0';
      return;
    }

    const vehiculo = this.vehiculoManager.obtenerPorId(vehiculoId);
    if (!vehiculo) return;

    // Calcular costo mediante el método de AlquilerManager
    const total = AlquilerManager.calcularCostoTotal(fechaInicio, fechaFin, vehiculo.costoPorDia);
    this.labelCostoTotal.textContent = `$${Number(total).toLocaleString()}`;
  }

  // Procesa la creación del nuevo alquiler al enviar el formulario
  handleCrearAlquiler(event) {
    event.preventDefault();

    const vehiculoId = this.selectVehiculo.value;
    const clienteId = this.selectCliente.value;
    const fechaInicio = this.inputFechaInicio.value;
    const fechaFinEstimada = this.inputFechaFin.value;

    // Obtener ID del usuario/operador logueado
    const usuarioActivo = JSON.parse(sessionStorage.getItem('usuario_activo') || '{}');
    const usuarioId = usuarioActivo.id || 'invitado';

    try {
      this.alquilerManager.crearAlquiler({
        vehiculoId,
        clienteId,
        usuarioId,
        fechaInicio,
        fechaFinEstimada
      });

      alert('Alquiler registrado');
      this.formAlquiler.reset();
      this.labelCostoTotal.textContent = '$0';

      // Actualizar la interfaz
      this.cargarSelectores();
      this.renderAlquileresActivos();
    } catch (error) {
      alert(`Error al procesar el alquiler: ${error.message}`);
    }
  }

  // Procesa el clic en el botón para marcar la devolución de un vehículo
  handleRegistrarDevolucion(alquilerId) {
    if (confirm('¿Confirma la devolución del vehículo?')) {
      const fechaHoy = new Date().toISOString().split('T')[0];
      
      try {
        this.alquilerManager.registrarDevolucion(alquilerId, fechaHoy);
        alert('Vehículo devuelto');
        
        // Refrescar selectores (para que el vehículo vuelva a estar disponible) y la tabla
        this.cargarSelectores();
        this.renderAlquileresActivos();
      } catch (error) {
        alert(`Error al registrar devolución: ${error.message}`);
      }
    }
  }

  // Renderiza la lista/tabla de préstamos actualmente activos
  renderAlquileresActivos() {
    if (!this.tablaAlquileresActivos) return;

    const alquileres = this.alquilerManager.obtenerTodos().filter(a => a.estado === 'ACTIVO');

    if (alquileres.length === 0) {
      this.tablaAlquileresActivos.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">
            No hay alquileres activos en este momento.
          </td>
        </tr>
      `;
      return;
    }

    this.tablaAlquileresActivos.innerHTML = alquileres.map(a => {
      const vehiculo = this.vehiculoManager.obtenerPorId(a.vehiculoId) || {};
      const cliente = this.clienteManager.obtenerPorId(a.clienteId) || {};

      return `
        <tr>
          <td>${vehiculo.marca || 'N/A'} ${vehiculo.modelo || ''} (${vehiculo.numeroChapa || ''})</td>
          <td>${cliente.nombre || 'N/A'}</td>
          <td>${a.fechaInicio}</td>
          <td>${a.fechaFinEstimada}</td>
          <td>$${Number(a.costoTotal).toLocaleString()}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="alquilerUI.handleRegistrarDevolucion('${a.id}')">
              Devolver
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}