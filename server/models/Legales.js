const connection = require('../lib/mysql');
const {config} = require('../config/config');

class LegalesModel{

    get(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT * FROM legales LIMIT 1`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        console.log(body);
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_LEGALES}(true,'${body.terminos}','${body.politica}')`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_LEGALES}(false,'${body.terminos}','${body.politica}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

}

module.exports = LegalesModel;