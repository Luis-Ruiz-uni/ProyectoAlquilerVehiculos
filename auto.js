class Auto extends Vehiculo{
    constructor(id, marca, modelo, anio, color, cantAsientos, numChapa, costoPorDia, imagen, capacidad, disponible, tipoTransmision, cantPuertas, tipoAuto){
        super(id, marca, modelo, anio, color, cantAsientos, numChapa, costoPorDia, imagen, capacidad, disponible);
        this.tipoTransmision = tipoTransmision;
        this.tipoAuto = tipoAuto;
    }
}