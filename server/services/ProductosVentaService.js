const ProductosVentaModel = require('../models/ProductosVenta');

class ProductosVentaService{
    constructor() {
        this.pvModel = new ProductosVentaModel();
    }

    async getAll(idVenta){
        const datos = await this.pvModel.getAll(idVenta).then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.pvModel.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body){
        const datos = await this.pvModel.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id){
        const datos = await this.pvModel.update(body,id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.pvModel.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = ProductosVentaService;