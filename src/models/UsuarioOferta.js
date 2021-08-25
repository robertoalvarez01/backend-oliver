const connection = require('../lib/mysql');
const {config} = require('../config/config');

class UsuarioOFertaModel{
    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_USUARIO_OFERTAS}`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_USUARIO_OFERTAS} WHERE id = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_USUARIOS_OFERTAS}('${body.email}')`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };
}

module.exports = UsuarioOFertaModel;