const connection = require('../lib/mysql');
const {config} = require('../config/config');

class MarcaModel{
    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_MARCA}`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_MARCA} WHERE idMarca = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body,imagen){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_MARCA}(0,'${body.marca}','${imagen}')`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id,imagen){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_MARCA}(${id},'${body.marca}','${imagen}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_MARCA_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = MarcaModel;