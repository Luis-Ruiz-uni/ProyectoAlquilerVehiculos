class CRUDClientesUI {
  constructor(clienteManager) {
    this.clienteManager = clienteManager;
    // Elementos del DOM
    this.formCliente = document.getElementById('form-cliente');
    this.inputClienteId = document.getElementById('cliente-id'); 
    this.inputNombre = document.getElementById('cliente-nombre');
    this.inputDocumento = document.getElementById('cliente-documento');
    this.inputTelefono = document.getElementById('cliente-telefono');
    this.inputEmail = document.getElementById('cliente-email');
    this.tablaClientes = document.getElementById('tabla-clientes');
    this.btnGuardar = document.getElementById('btn-guardar-cliente');

    this.initEvents();
  }

  // Registra los listener para submit del formulario y acciones en la tabla
  initEvents() {
    if (this.formCliente) {
      this.formCliente.addEventListener('submit', (e) => this.handleGuardarCliente(e));
    }

    // 2. Delegación de eventos en la tabla (para los botones Editar y Eliminar)
    if (this.tablaClientes) {
      this.tablaClientes.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar-cliente');
        const btnEliminar = e.target.closest('.btn-eliminar-cliente');
        if (btnEditar) {
          const id = btnEditar.dataset.id;
          this.handleEditarCliente(id);
        }
        if (btnEliminar) {
          const id = btnEliminar.dataset.id;
          this.handleEliminarCliente(id);
        }
      });
    }
  }

  // Captura los datos del formulario de cliente y los guarda a través del Manager
  handleGuardarCliente(event) {
    event.preventDefault();

    const id = this.inputClienteId ? this.inputClienteId.value : '';
    const clienteData = {
      nombre: this.inputNombre.value.trim(),
      documento: this.inputDocumento.value.trim(),
      telefono: this.inputTelefono.value.trim(),
      email: this.inputEmail.value.trim()
    };

    if (id) {
      // Si existe un ID en el campo oculto, es una Edición
      this.clienteManager.actualizar(id, clienteData);
      alert('Cliente actualizado con éxito.');
    } else {
      // Si no hay ID, se trata de un Nuevo Cliente
      this.clienteManager.agregar(clienteData);
      alert('Cliente registrado con éxito.');
    }

    this.resetFormulario();
    this.renderTablaClientes();
  }

  // Carga los datos de un cliente en el formulario para su edición
  handleEditarCliente(clienteId) {
    const cliente = this.clienteManager.obtenerPorId(clienteId);
    if (!cliente) return;
    this.inputClienteId.value = cliente.id;
    this.inputNombre.value = cliente.nombre;
    this.inputDocumento.value = cliente.documento;
    this.inputTelefono.value = cliente.telefono;
    this.inputEmail.value = cliente.email;

    if (this.btnGuardar) this.btnGuardar.textContent = 'Actualizar Cliente';
  }

  handleEliminarCliente(clienteId) {
    if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
      if (typeof this.clienteManager.eliminar === 'function') {
        this.clienteManager.eliminar(clienteId);
        this.renderTablaClientes();
      } else {
        alert('Agregue el método eliminar() en su ClienteManager.');
      }
    }
  }

  resetFormulario() {
    this.formCliente.reset();
    if (this.inputClienteId) this.inputClienteId.value = '';
    if (this.btnGuardar) this.btnGuardar.textContent = 'Guardar Cliente';
  }

  // Renderiza la lista completa de clientes registrados en una tabla HTML
  renderTablaClientes() {
    if (!this.tablaClientes) return;
    const clientes = this.clienteManager.obtenerTodos();
    if (clientes.length === 0) {
      this.tablaClientes.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1rem;">
            No hay clientes registrados.
          </td>
        </tr>
      `;
      return;
    }

    this.tablaClientes.innerHTML = clientes.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.nombre}</td>
        <td>${c.documento}</td>
        <td>${c.telefono || 'N/A'}</td>
        <td>
          <button class="btn btn-secondary btn-sm btn-editar-cliente" data-id="${c.id}">Editar</button>
          <button class="btn btn-danger btn-sm btn-eliminar-cliente" data-id="${c.id}">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }
}