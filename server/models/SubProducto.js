const connection = require('../lib/mysql');
const {config} = require('../config/config');

class SubProductoModel{
    getAll(desde,limite){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,producto,subProducto,codigoBarra,stock,minStock,
            peso,tamaño,subprd.precioUnidad,foto,marca,prd.idMarca
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, 
                        ${config.TABLE_TAM} as tm, ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño
                        AND mk.idMarca = prd.idMarca
                        ORDER BY idSubProducto DESC LIMIT ${desde},${limite}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subprd.idProducto,producto,descripcion,descripcion_basica,subProducto,codigoBarra,    stock,minStock,peso,subprd.idTamaño,tamaño,subprd.precioUnidad,foto,mk.marca
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm,${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND mk.idMarca = prd.idMarca AND idSubProducto = ${id}`;
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    getByIdProducto(idProducto,idSubProducto){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subprd.idProducto,producto,subProducto,codigoBarra,stock,
                                minStock,peso,subprd.idTamaño,tamaño,subprd.precioUnidad,foto,mk.marca
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm, ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND mk.idMarca = prd.idMarca
                        AND subprd.idProducto = ${idProducto} AND idSubProducto <> ${idSubProducto}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    search(key){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subProducto,producto,tamaño,peso,stock,foto,mk.marca
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm,
                        ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND mk.idMarca = prd.idMarca
                        AND subProducto LIKE '%${key}%'`;
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    filtrar(categoria,subcategoria,marca,desde,limite){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,producto,subProducto,codigoBarra,stock,minStock,
                        peso,tamaño,subprd.precioUnidad,subprd.foto,categoria,prd.idCategoria,marca,prd.idMarca,sc.subcategoria
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm,
                        ${config.TABLE_CATEGORIA} as cat, ${config.TABLE_MARCA} as mk,${config.TABLE_SUB_CATEGORIA} as sc
                            WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND cat.idCategoria = prd.idCategoria AND mk.idMarca = prd.idMarca AND sc.idSubCategoria = prd.idSubCategoria`;
            if(categoria){
                query += ` AND prd.idCategoria = ${categoria}`;
            }
            if(subcategoria){
                query += ` AND prd.idSubCategoria = ${subcategoria}`;
            }
            if(marca){
                query += ` AND prd.idMarca = ${marca}`;
            }
            query += ` ORDER BY idSubProducto DESC LIMIT ${desde},${limite};`
            connection.query(query,(err,results,fields)=>{
                if(err) reject(err);
                resolve(results);
            })
        })
    }

    create(body,foto){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_SUBPRODUCTO}(0,${body.idProducto},'${body.subProducto}','${body.codigoBarra}',
            ${body.stock},${body.minStock},'${body.peso}',${body.idTamaño},'${body.precioUnidad}','${foto}')`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id,foto){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_SUBPRODUCTO}(${id},${body.idProducto},'${body.subProducto}','${body.codigoBarra}',
            ${body.stock},${body.minStock},'${body.peso}',${body.idTamaño},'${body.precioUnidad}','${foto}')`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_SUBPRODUCTO_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = SubProductoModel;
