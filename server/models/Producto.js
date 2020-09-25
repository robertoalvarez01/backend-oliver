const connection = require('../lib/mysql');
const {config} = require('../config/config');

class ProductoModel{
    getAll(desde,limite){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,precioUnidad,descripcion
                                ,descripcion_basica,disponible,categoria,marca
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca
                        LIMIT ${limite}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,precioUnidad,descripcion
                                ,descripcion_basica,disponible,prd.idCategoria,categoria,prd.idMarca,marca
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca AND idProducto = ${id}`;
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    search(key){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,precioUnidad,descripcion
                                ,descripcion_basica,disponible,categoria,marca
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca AND producto LIKE '%${key}%'`;
            console.log(query);
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body,foto){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_PRODUCTO}(0,'${body.producto}','${body.precioUnidad}','${body.descripcion}',
            '${body.descripcionBasica}',${body.disponible},${body.idCategoria},${body.idMarca})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id,foto){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_PRODUCTO}(${id},'${body.producto}','${body.precioUnidad}','${body.descripcion}',
            '${body.descripcionBasica}',${body.disponible},${body.idCategoria},${body.idMarca})`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_PRODUCTO_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = ProductoModel;