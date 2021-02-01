const EnvioModel = require('../models/Envio');

class EnvioService{
    constructor() {
        this.eModel = new EnvioModel();
    }

    async getAll(){
        const datos = await this.eModel.getAll().then(res=>{
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

    async cambiarEstado(id){
        const response = await this.eModel.cambiarEstado(id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

}

module.exports = EnvioService;