const connection = require('../lib/mysql');
const {config} = require('../config/config');

class BannerModel{
    getAll(isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT * FROM ${config.TABLE_BANNERS}`;
            if(!isAdmin){
                query += " WHERE activo = 1";
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM ${config.TABLE_BANNERS} WHERE idBanner = ${id}`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body,imagen){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_BANNERS}(0,'${imagen}','${body.descripcion}',${body.activo})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id,imagen){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_BANNERS}(${id},'${imagen}','${body.descripcion}',${body.activo})`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_BANNERS_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = BannerModel;