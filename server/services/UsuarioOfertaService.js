const UsuarioOfertaModel = require('../models/UsuarioOferta');

class UsuarioOfertaService{
    constructor(){
        this.usuarioOferta = new UsuarioOfertaModel();
    }

    async getAll(){
        const datos = await this.usuarioOferta.getAll().then(res=>{
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.usuarioOferta.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async create(body){
        const datos = await this.usuarioOferta.create(body).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }
}

module.exports = UsuarioOfertaService;