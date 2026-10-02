class IdManager {

  static obtenerSiguienteId(claveEntidad) {
    const storageKey = `secuencia_${claveEntidad}`;
    const ultimoId = parseInt(localStorage.getItem(storageKey) || '0', 10);
    const nuevoId = ultimoId + 1;
    localStorage.setItem(storageKey, nuevoId.toString());
    
    return nuevoId;
  }
}