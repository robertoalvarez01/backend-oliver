const LegalesModel = require('../models/Legales');

class LegalesService{
    constructor(){
        this.legales = new LegalesModel();
    }
    async get(){
        const datos = await this.legales.get().then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async create(body){
        const datos = await this.legales.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body){
        const datos = await this.legales.update(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = LegalesService;