const CategoriaModel = require('../models/Categoria');

class CategoriaService{
    constructor(){
        this.categoria = new CategoriaModel();
    }
    async getAll(){
        const datos = await this.categoria.getAll().then(res=>{
            console.log(res); 
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.categoria.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body,foto){
        const datos = await this.categoria.create(body,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,foto){
        const datos = await this.categoria.update(body,id,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.categoria.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = CategoriaService;