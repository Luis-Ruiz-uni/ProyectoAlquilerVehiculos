

let authUI, catalogoUI, alquilerUI, clientesUI, usuariosUI, reportesUI;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Instanciar Managers
  const vehiculoManager = new VehiculoManager();
  const clienteManager = new ClienteManager();
  const usuarioManager = new UsuarioManager();
  const alquilerManager = new AlquilerManager(vehiculoManager);

  // 2. Instanciar Controladores UI
  authUI = new AuthUI(usuarioManager);
  catalogoUI = new CatalogoUI(vehiculoManager);
  alquilerUI = new AlquilerUI(alquilerManager, vehiculoManager, clienteManager);
  clientesUI = new CRUDClientesUI(clienteManager);
  usuariosUI = new CRUDUsuariosUI(usuarioManager);
  reportesUI = new ReportesUI(alquilerManager, vehiculoManager, clienteManager);

  // 3. Cargar datos iniciales
  catalogoUI.aplicarFiltros();

  // 4. Actualizar vistas dependientes al cambiar de pestaña
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const viewId = btn.getAttribute('data-view');
      if (viewId === 'view-alquileres') {
        alquilerUI.cargarSelectores();
        alquilerUI.renderAlquileresActivos();
      } else if (viewId === 'view-clientes') {
        clientesUI.renderTablaClientes();
      } else if (viewId === 'view-usuarios') {
        usuariosUI.renderTablaUsuarios();
      } else if (viewId === 'view-reportes') {
        reportesUI.generarInformeVencidos();
      }
    });
  });
});