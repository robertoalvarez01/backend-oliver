const connection = require('../lib/mysql');
const {config} = require('../config/config');


class EnvioModel{

    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_ENVIO}.* , ${config.TABLE_ZONAS}.zona FROM ${config.TABLE_ENVIO} LEFT JOIN ${config.TABLE_ZONAS} ON ${config.TABLE_ZONAS}.idZona = ${config.TABLE_ENVIO}.idZona`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_ENVIO}.* , ${config.TABLE_ZONAS}.zona FROM ${config.TABLE_ENVIO} LEFT JOIN ${config.TABLE_ZONAS} ON ${config.TABLE_ZONAS}.idZona = ${config.TABLE_ENVIO}.idZona WHERE idEnvio = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_ENVIO}(0,${body.idZona},'${body.tipo}',0)`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                return connection.query(`SELECT idEnvio from ${config.TABLE_ENVIO} order by idEnvio DESC limit 1`,(err,res)=>{
                    if(error) return reject(error);
                    resolve(res);
                })
            })
        })
    };

    update(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_ENVIO}(${id},${body.idZona},'${body.tipo}',${body.entregado})`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_ENVIO_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    cambiarEstado(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_ENVIO_ENTREGADO_NOENTREGADO}(${id})`,(err,res,fields)=>{
                if(err) reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = EnvioModel;