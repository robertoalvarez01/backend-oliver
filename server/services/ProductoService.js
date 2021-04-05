const ProductoModel = require('../models/Producto');

class ProductoService{
    constructor(){
        this.producto = new ProductoModel();
    }
    async getAll(desde,limite,isAdmin){
        const datos = await this.producto.getAll(desde,limite,isAdmin).then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.producto.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async search(key,isAdmin){
        const datos = await this.producto.search(key,isAdmin).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async filtrar(categoria,subcategoria,marca,desde,limite){
        const datos = await this.producto.filtrar(categoria,subcategoria,marca,desde,limite).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body,avatar=null){
        const datos = await this.producto.create(body,avatar).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,foto=null){
        const datos = await this.producto.update(body,id,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.producto.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = ProductoService;