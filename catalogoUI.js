class CatalogoUI {
  constructor(vehiculoManager) {
    this.vehiculoManager = vehiculoManager;
    // Elementos del DOM
    this.gridContainer = document.getElementById('vehiculos-grid');
    this.inputMarca = document.getElementById('filter-marca');
    this.inputModelo = document.getElementById('filter-modelo');
    this.inputAnio = document.getElementById('filter-anio');
    this.selectDisponibilidad = document.getElementById('filter-disponibilidad');

    this.initEvents();
  }

  // Suscribe los eventos 'input' y 'change' de los filtros para filtrar en tiempo real
  initEvents() {
    const filtros = [
      this.inputMarca,
      this.inputModelo,
      this.inputAnio,
      this.selectDisponibilidad
    ];
    filtros.forEach(control => {
      if (control) {
        control.addEventListener('input', () => this.aplicarFiltros());
        control.addEventListener('change', () => this.aplicarFiltros());
      }
    });
  }

  // Captura los valores de los controles de filtro y los envía al VehiculoManager
  aplicarFiltros() {
    const criterio = {
      marca: this.inputMarca ? this.inputMarca.value : '',
      modelo: this.inputModelo ? this.inputModelo.value : '',
      anio: this.inputAnio ? this.inputAnio.value : '',
      disponibilidad: this.selectDisponibilidad ? this.selectDisponibilidad.value : 'todos'
    };
    const vehiculosFiltrados = this.vehiculoManager.filtrar(criterio);
    this.renderVehiculos(vehiculosFiltrados);
  }

// Renderiza el arreglo de vehículos en forma de tarjetas (cards) en el DOM
  renderVehiculos(listaVehiculos) {
    if (!this.gridContainer) return;

    // 1. Manejo de estado vacío
    if (!listaVehiculos || listaVehiculos.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No se encontraron vehículos que coincidan con los filtros aplicados.</p>
        </div>
      `;
      return;
    }

    // 2. Iterar sobre CADA vehículo para generar el HTML
    this.gridContainer.innerHTML = listaVehiculos.map(vehiculo => {
      const estadoBadge = vehiculo.disponible
        ? '<span class="badge badge-success">Disponible</span>'
        : '<span class="badge badge-danger">Alquilado</span>';

      const imagenUrl = vehiculo.imagen || 'https://placehold.co/300x180?text=Sin+Imagen';

      return `
        <article class="card" data-id="${vehiculo.id}">
          <img src="${imagenUrl}" alt="${vehiculo.marca} ${vehiculo.modelo}" class="card-img">
          <div class="card-body">
            ${estadoBadge}
            <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
            <p class="card-meta">Año: ${vehiculo.anio} | Color: ${vehiculo.color} | Asientos: ${vehiculo.cantAsientos}</p>
            <p class="card-chapa">Chapa: ${vehiculo.numeroChapa}</p>
            <p class="card-price">$${Number(vehiculo.costoPorDia).toLocaleString()} <span>/ día</span></p>
            <button 
              class="btn btn-primary btn-block btn-alquilar" 
              data-id="${vehiculo.id}" 
              ${!vehiculo.disponible ? 'disabled' : ''}>
              ${vehiculo.disponible ? 'Alquilar' : 'No disponible'}
            </button>
          </div>
        </article>
      `;
    }).join(''); // Importante: .join('') para convertir el array en un string limpio de HTML
  }

  // Genera el HTML de una tarjeta individual de vehículo
  crearTarjetaVehiculoHTML(vehiculo) {
    if (!this.gridContainer) return;
    if (!listaVehiculos || listaVehiculos.length === 0) {
      this.gridContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No se encontraron vehículos que coincidan con los filtros aplicados.</p>
        </div>
      `;
      return;
    }
    this.gridContainer.innerHTML = listaVehiculos
      .map(vehiculo => this.crearTarjetaVehiculoHTML(vehiculo))
      .join('');
  }
}