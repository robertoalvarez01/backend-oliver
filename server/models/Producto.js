const connection = require('../lib/mysql');
const {config} = require('../config/config');

class ProductoModel{
    getAll(desde,limite,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,categoria,marca,precioUnidad
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca `;
            if(!isAdmin){
                query += `AND mostrar = 1 `;
            }
            query += `LIMIT ${desde},${limite}`
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,precioUnidad,descripcion
                                ,descripcion_basica,prd.idCategoria,categoria,prd.idMarca,marca,prd.idSubCategoria,sc.subcategoria,prd.mostrar
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk,${config.TABLE_SUB_CATEGORIA} as sc
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca AND sc.idSubCategoria = prd.idSubCategoria  AND idProducto = ${id}`;
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    search(key,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,precioUnidad,categoria,marca
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca AND producto LIKE '%${key}%' OR categoria LIKE '%${key}%'`;
            if(!isAdmin){
                query += ` AND mostrar = 1`;
            }
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    filtrar(categoria,subcategoria,marca,desde,limite){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idProducto,producto,categoria,marca,precioUnidad
                        FROM ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk
                        WHERE prd.idCategoria = cat.idCategoria AND prd.idMarca = mk.idMarca`;
            if(categoria){
                query += ` AND prd.idCategoria = ${categoria}`;
            }
            if(subcategoria){
                query += ` AND prd.idSubCategoria = ${subcategoria}`;
            }
            if(marca){
                query += ` AND prd.idMarca = ${marca}`;
            }
            query += ` AND mostrar = 1 ORDER BY idProducto DESC LIMIT ${desde},${limite};`
            connection.query(query,(err,results,fields)=>{
                if(err) reject(err);
                resolve(results);
            })
        })
    }

    create(body,foto){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_PRODUCTO}(0,'${body.producto}','${body.precioUnidad}','${body.descripcion}',
            '${body.descripcionBasica}',${body.idCategoria},${body.idMarca},${body.idSubCategoria},${body.mostrar})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };
    
    update(body,id,foto){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_PRODUCTO}(${id},'${body.producto}','${body.precioUnidad}','${body.descripcion}',
            '${body.descripcionBasica}',${body.idCategoria},${body.idMarca},${body.idSubCategoria},${body.mostrar})`;
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
