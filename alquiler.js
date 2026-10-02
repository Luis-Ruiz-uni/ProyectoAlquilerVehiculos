class Alquiler{
    constructor(id, vehiculoId, clienteId, usuarioId, fechaInicio, fechaEstimadaFin, fechaDevolucion, costoTotal, estado){
        this.id = id;
        this.vehiculoId = vehiculoId;
        this.clienteId = clienteId;
        this.usuarioId = usuarioId;
        this.fechaInicio = fechaInicio;
        this.fechaEstimadaFin = fechaEstimadaFin;
        this.fechaDevolucion = fechaDevolucion;
        this.costoTotal = costoTotal;
        this.estado = estado;
        }
        
        estaVencido(){
            const fechaActual = new Date();
            if(fechaActual > this.fechaEstimadaFin){
                return true;
            }
            else{
                return false;
            }
        }

        calcularCostoTotal(){
            const dif = this.fechaDevolucion - this.fechaInicio;
            const diasAlquilados = Math.ceil(dif / (24 * 60 * 60 * 1000));
            if (diasAlquilados <= 0) diasAlquilados = 1;

            this.costoTotal = diasAlquilados * VehiculoManager.obtenerPorId;

            

        }

}