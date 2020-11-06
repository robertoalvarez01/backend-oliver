const SubProductoModel = require('../models/SubProducto');

class SubProductoService{
    constructor(){
        this.subproducto = new SubProductoModel();
    }
    async getAll(desde,limite){
        const datos = await this.subproducto.getAll(desde,limite).then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.subproducto.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getByIdProducto(idProducto,idSubProducto){
        const datos = await this.subproducto.getByIdProducto(idProducto,idSubProducto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async search(key){
        const datos = await this.subproducto.search(key).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async filtrar(categoria,subcategoria,marca,desde,limite){
        const datos = await this.subproducto.filtrar(categoria,subcategoria,marca,desde,limite).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body,foto=null){
        const datos = await this.subproducto.create(body,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,foto=null){
        const datos = await this.subproducto.update(body,id,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.subproducto.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = SubProductoService;