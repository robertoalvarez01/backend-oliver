const connection = require('../lib/mysql');
const {config} = require('../config/config');
const bcrypt = require('bcrypt');

class UsuarioModel{
    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_USER}`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT email,nombre,telefono,foto,lon,lat,address,puntos FROM ${config.TABLE_USER} WHERE idUsuario = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }
    update(body,id,foto){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_USUARIO}(${id},'${body.email}','${body.password}','${body.nombre}','${body.telefono}',
            ${body.admin},'${foto}','web','${body.ubicacion}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    updateFromWeb(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_USUARIO_UPDATE_WEB}(${id},'${body.nombre}','${body.telefono}',
            ${body.lon},'${body.lat}','${body.address}','null')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    }

    updateFotoFromWeb(foto,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_USUARIO_UPDATE_WEB}(${id},'null','null',
            'null','null','null','${foto}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    }

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_USUARIO_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }


    //login and registers

    register(body,foto){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            bcrypt.hash(body.password, 10,(err,hash)=>{
                if(err) reject(err);
                let query = `CALL ${config.SP_USUARIO}(0,'${body.email}','${hash}','${body.nombre}','${body.telefono}',
                0,'${foto}','web','${body.lon}','${body.lat}','${body.address}')`;
                connection.query(query,(error,results,fields)=>{
                    if(error) return reject(error);
                    resolve(results);
                })
            })
        })
    };

    registerWithGoogle(data){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_USUARIO}(0,'${data.email}',null,'${data.nombre}',null,
            0,'${data.foto}','Google',null,null,null)`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            }) 
        })
    }


    login(body){
        return new Promise((resolve,reject)=>{
            let query = `SELECT * FROM ${config.TABLE_USER} 
                        WHERE email = '${body.email}' LIMIT 1`;
            connection.query(query,(err,res,fiels)=>{
                if(err) reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = UsuarioModel;