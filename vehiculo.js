class Vehiculo {
    constructor(id, marca, modelo, anio, color, cantAsientos, numChapa, costoPorDia, imagen, capacidad, disponible){
        this.id = id;
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.color = color;
        this.cantAsientos = cantAsientos;
        this.numChapa = numChapa;
        this.costoPorDia = costoPorDia;
        this.imagen = imagen;
        this.capacidad = capacidad;
        this.disponible = disponible;
    }

    get

    getCostoporDia(){
        return this.costoPorDia;
    }

    marcarAlquilado(){
        this.disponible = false;
    }

    marcarDisponible(){
        this.disponible = true;
    }

    toJSON(){
        localStorage.setItem(this.id.toString(), JSON.stringify(this, 4, undefinded));
    }

    fromJSON(){
        localStorage.getItem(this.id.toString());
    }
}