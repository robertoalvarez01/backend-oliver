const VentasModel = require('../models/Ventas');

class VentasService{
    constructor() {
        this.vModel = new VentasModel();
    }

    async getAll(){
        const datos = await this.vModel.getAll().then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.vModel.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getByEnvio(idEnvio){
        const datos = await this.vModel.getByEnvio(idEnvio).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getByOperacionId(id){
        const datos = await this.vModel.getByEnvio(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body){
        const datos = await this.vModel.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id){
        const datos = await this.vModel.update(body,id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.vModel.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async cambiarEstadoPago(id){
        const datos = await this.vModel.cambiarEstadoPago(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getCantidadDeVentasPorUsuario(idUsuario){
        const datos = await this.vModel.getCantidadByIdUsuario(idUsuario).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getVentasPorUsuario(idUsuario,cantidad=10){
        const datos = await this.vModel.getVentasByIdUsuario(idUsuario,cantidad).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

}

module.exports = VentasService;