class StorageManager{
    static guardar(clave, datos){
        localStorage.setItem(clave.toString(), JSON.stringify(datos));
    }

    static obtener(clave){
        const obj = localStorage.getItem(clave.toString());
        return obj ? JSON.parse(obj) : null;
    }

    static limpiar(){
        localStorage.clear();
    }

}