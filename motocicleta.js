class Motocicleta extends Vehiculo{
        constructor(id, marca, modelo, anio, color, cantAsientos, numChapa, costoPorDia, imagen, disponible, cilindrada, tipoMoto){
                super(id, marca, modelo, anio, color, cantAsientos,  numChapa, costoPorDia, imagen, capacidad, disponible);
                this.cilindrada = cilindrada;
                this.tipoMoto = tipoMoto;
        }

}