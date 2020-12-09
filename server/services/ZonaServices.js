const ZonaModel = require('../models/Zona');

class ZonaServices{
    constructor() {
        this.zonaModel = new ZonaModel();
    }

    async getAll(){
        const datos = await this.zonaModel.getAll().then(res=>{
            return res;
        }).catch(err=>{
            return err;
        }); 
        return datos;
    }

    async getOne(id){
        const datos = await this.zonaModel.getOne(id).then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async create(body){
        const response = await this.zonaModel.create(body).then(res=>{
            return res;
        }).catch(err=>err); 
        return response;
    }

    async update(body,id){
        const response = await this.zonaModel.update(body,id).then(res=>{
            return res;
        }).catch(err=>err); 
        return response;
    }
    
    async delete(id){
        const response = await this.zonaModel.delete(id).then(res=>{
            return res;
        }).catch(err=>err); 
        return response;
    }
}

module.exports = ZonaServices