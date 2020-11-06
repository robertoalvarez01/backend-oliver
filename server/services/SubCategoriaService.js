const SubCategoriaModel = require('../models/SubCategoria');

class SubCategoriaService{
    constructor(){
        this.subcategoria = new SubCategoriaModel();
    }
    async getAll(){
        const datos = await this.subcategoria.getAll().then(res=>{
            console.log(res); 
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.subcategoria.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body){
        const datos = await this.subcategoria.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id){
        const datos = await this.subcategoria.update(body,id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.subcategoria.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = SubCategoriaService;