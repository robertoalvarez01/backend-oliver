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

    async verificarVentaDuplicada(id){
        const response = await this.vModel.getByOperacionId(id).then(res=>res).catch(err=>err);
        return response;
    }

}

module.exports = VentasService;