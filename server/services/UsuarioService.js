const UsuarioModel = require('../models/Usuario');

class UsuarioService{
    constructor(){
        this.usuario = new UsuarioModel();
    }
    async getAll(){
        const datos = await this.usuario.getAll().then(res=>{
            console.log(res); 
            return res;
        }).catch(err=>err); 
        return datos;
    }

    async getOne(id){
        const datos = await this.usuario.get(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async getBytoken(token){
        const datos = await this.usuario.getByToken(token).then(res=>{
            return res;
        }).catch(err=>err);
        return datos
    }

    async create(body,avatar){
        const datos = await this.usuario.register(body,avatar).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async update(body,id,foto=null){
        const datos = await this.usuario.update(body,id,foto).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async refreshToken(token,idUsuario){
        const response = await this.usuario.refreshToken(token,idUsuario).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async resetPassword(email,password){
        const response = await this.usuario.resetPassword(email,password).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async updateFromWeb(body,id){
        const response = await this.usuario.updateFromWeb(body,id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async updateAddress(data,id){
        const response = await this.usuario.updateAddress(data,id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async updateFotoFromWeb(foto,id){
        const response = await this.usuario.updateFotoFromWeb(foto,id).then(res=>{
            return res;
        }).catch(err=>err);
        return response;
    }

    async delete(id){
        const datos = await this.usuario.delete(id).then(res=>{
            return res;
        }).catch(err=>err);
        return datos;
    }

    async login(body){
        const users = await this.usuario.login(body).then(res=>res).catch(err=>err);
        return users;
    }
}

module.exports = UsuarioService;