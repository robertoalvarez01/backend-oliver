const connection = require('../lib/mysql');
const {config} = require('../config/config');

class SubCategoriaModel{
    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT idSubCategoria,subcategoria 
                                FROM ${config.TABLE_SUB_CATEGORIA} ORDER BY idSubCategoria DESC`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT idSubCategoria,subcategoria FROM ${config.TABLE_SUB_CATEGORIA}
                            WHERE idSubCategoria = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_SUBCATEGORIA}(0,'${body.subcategoria}')`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_SUBCATEGORIA}(${id},'${body.subcategoria}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_SUBCATEGORIA_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = SubCategoriaModel;