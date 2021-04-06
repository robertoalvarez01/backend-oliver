const BannerModel = require('../models/Banner');

class MarcaService{
    constructor(){
        this.banner = new BannerModel();
    }
    async getAll(isAdmin){
        const datos = await this.banner.getAll(isAdmin).then(res=>{
            console.log(res); 
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.banner.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body,foto){
        const datos = await this.banner.create(body,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,foto=null){
        const datos = await this.banner.update(body,id,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async delete(id){
        const datos = await this.banner.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = MarcaService;