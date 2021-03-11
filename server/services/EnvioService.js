const EnvioModel = require('../models/Envio');

class EnvioService{
    constructor() {
        this.eModel = new EnvioModel();
    }

    async getAll(idEnvio=null,tipo=null){
        const datos = await this.eModel.getAll(idEnvio,tipo).then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.eModel.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body){
        const datos = await this.eModel.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async setQrCode(idEnvio,qr){
        const response = await this.eModel.setQrCode(idEnvio,qr).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async update(body,id){
        const datos = await this.eModel.update(body,id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.eModel.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async cambiarEstadoEntregado(id){
        const response = await this.eModel.cambiarEstadoEntregado(id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async cambiarEstadoEnCamino(id){
        const response = await this.eModel.cambiarEstadoEnCamino(id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }
}

module.exports = EnvioService;