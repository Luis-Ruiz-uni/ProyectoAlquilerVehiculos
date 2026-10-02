class ReportesUI {
  constructor(alquilerManager, vehiculoManager, clienteManager) {
    this.alquilerManager = alquilerManager;
    this.vehiculoManager = vehiculoManager;
    this.clienteManager = clienteManager;

    // Referencias al DOM para el Reporte 1 (Entre Fechas)
    this.inputFechaDesde = document.getElementById('reporte-fecha-desde');
    this.inputFechaHasta = document.getElementById('reporte-fecha-hasta');
    this.btnBuscarFechas = document.getElementById('btn-buscar-reporte-fechas');
    this.tablaReporteFechas = document.getElementById('tabla-reporte-fechas');

    // Referencias al DOM para el Reporte 2 (Préstamos Vencidos)
    this.tablaReporteVencidos = document.getElementById('tabla-reporte-vencidos');
    this.btnActualizarVencidos = document.getElementById('btn-actualizar-vencidos');

    this.initEvents();
  }

  initEvents() {
    // 1. Evento para filtrar alquileres por rango de fechas
    if (this.btnBuscarFechas) {
      this.btnBuscarFechas.addEventListener('click', () => this.generarInformeFechas());
    }

    // 2. Evento para recargar el informe de vencidos
    if (this.btnActualizarVencidos) {
      this.btnActualizarVencidos.addEventListener('click', () => this.generarInformeVencidos());
    }
  }
  generarInformeFechas() {
    const fechaDesde = this.inputFechaDesde ? this.inputFechaDesde.value : '';
    const fechaHasta = this.inputFechaHasta ? this.inputFechaHasta.value : '';

    if (!fechaDesde || !fechaHasta) {
      alert('Por favor seleccione ambas fechas para generar el informe.');
      return;
    }

    if (new Date(fechaDesde) > new Date(fechaHasta)) {
      alert('La fecha inicial no puede ser posterior a la fecha final.');
      return;
    }

    const alquileres = this.alquilerManager.obtenerPrestadosEntreFechas(fechaDesde, fechaHasta);
    this.renderTablaFechas(alquileres);
  }

  renderTablaFechas(listaAlquileres) {
    if (!this.tablaReporteFechas) return;

    if (!listaAlquileres || listaAlquileres.length === 0) {
      this.tablaReporteFechas.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 1rem;">
            No se registraron préstamos en el rango de fechas seleccionado.
          </td>
        </tr>
      `;
      return;
    }

    this.tablaReporteFechas.innerHTML = listaAlquileres.map(a => {
      const vehiculo = this.vehiculoManager.obtenerPorId(a.vehiculoId) || {};
      const cliente = this.clienteManager.obtenerPorId(a.clienteId) || {};

      return `
        <tr>
          <td>${a.fechaInicio}</td>
          <td>${vehiculo.marca || 'N/A'} ${vehiculo.modelo || ''} (${vehiculo.numeroChapa || ''})</td>
          <td>${cliente.nombre || 'N/A'} (Doc: ${cliente.documento || ''})</td>
          <td>${a.fechaFinEstimada}</td>
          <td><span class="badge ${a.estado === 'ACTIVO' ? 'badge-danger' : 'badge-success'}">${a.estado}</span></td>
          <td>$${Number(a.costoTotal).toLocaleString()}</td>
        </tr>
      `;
    }).join('');
  }
  generarInformeVencidos() {
    const prestamosVencidos = this.alquilerManager.obtenerClientesConPrestamosVencidos();
    this.renderTablaVencidos(prestamosVencidos);
  }

  renderTablaVencidos(listaVencidos) {
    if (!this.tablaReporteVencidos) return;

    if (!listaVencidos || listaVencidos.length === 0) {
      this.tablaReporteVencidos.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--success); padding: 1rem; font-weight: 600;">
            ¡Excelente! No hay clientes con préstamos vencidos en este momento.
          </td>
        </tr>
      `;
      return;
    }

    const hoy = new Date();

    this.tablaReporteVencidos.innerHTML = listaVencidos.map(a => {
      const cliente = this.clienteManager.obtenerPorId(a.clienteId) || {};
      const vehiculo = this.vehiculoManager.obtenerPorId(a.vehiculoId) || {};

      // Calcular días de retraso
      const fechaFin = new Date(a.fechaFinEstimada);
      const diferenciaMs = hoy.getTime() - fechaFin.getTime();
      const diasVencido = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24));

      return `
        <tr style="background-color: #fff5f5;">
          <td><strong>${cliente.nombre || 'N/A'}</strong></td>
          <td>${cliente.telefono || 'Sin teléfono'} / ${cliente.email || 'Sin email'}</td>
          <td>${vehiculo.marca || 'N/A'} ${vehiculo.modelo || ''} (${vehiculo.numeroChapa || ''})</td>
          <td>${a.fechaFinEstimada}</td>
          <td><span class="badge badge-danger">${diasVencido} día(s) de atraso</span></td>
          <td>$${Number(a.costoTotal).toLocaleString()}</td>
        </tr>
      `;
    }).join('');
  }
}