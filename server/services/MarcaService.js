const MarcaModel = require('../models/Marca');

class MarcaService{
    constructor(){
        this.marca = new MarcaModel();
    }
    async getAll(){
        const datos = await this.marca.getAll().then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.marca.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body,imagen=null){
        const datos = await this.marca.create(body,imagen).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,imagen=null){
        const datos = await this.marca.update(body,id,imagen).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.marca.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = MarcaService;