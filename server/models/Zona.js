const connection = require('../lib/mysql');
const {config} = require('../config/config');

class ZonaModel{
    
    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_ZONAS}`,(err,res,fields)=>{
                if(err) return reject(err);
                return resolve(res);
            })
        })
    }

    getOne(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_ZONAS} WHERE idZona = ${id}`,(err,res,fields)=>{
                if(err) return reject(err);
                return resolve(res);
            })
        })
    }

    create(body){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_ZONAS}(0,'${body.zona}','${body.dia}','${body.precio}')`,(err,res,fields)=>{
                if(err) return reject(err);
                return resolve(res);
            })
        })
    }

    update(body,id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_ZONAS}(${id},'${body.zona}','${body.dia}','${body.precio}')`,(err,res,fields)=>{
                if(err) return reject(err);
                return resolve(res);
            })
        })
    }

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_ZONAS_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                return resolve(res);
            })
        })
    }
}

module.exports = ZonaModel;