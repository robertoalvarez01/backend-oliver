const connection = require('../lib/mysql');
const {config} = require('../config/config');


class ProductosVentasModel{

    getAll(idVenta){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT idProductosVenta, cantidad, ${config.TABLE_PRODUCTO}.producto , ${config.TABLE_SUB_PRODUCTO}.subProducto , ${config.TABLE_SUB_PRODUCTO}.foto, ${config.TABLE_SUB_PRODUCTO}.precioUnidad
            FROM ${config.TABLE_PRODUCTOSVENTA}
                LEFT JOIN ${config.TABLE_PRODUCTO} ON ${config.TABLE_PRODUCTO}.idProducto = ${config.TABLE_PRODUCTOSVENTA}.idProducto
                    LEFT JOIN ${config.TABLE_SUB_PRODUCTO} ON ${config.TABLE_SUB_PRODUCTO}.idSubProducto = ${config.TABLE_PRODUCTOSVENTA}.idSubProducto WHERE ${config.TABLE_PRODUCTOSVENTA}.idVenta = ${idVenta};`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT idProductosVenta, cantidad, ${config.TABLE_PRODUCTO}.producto , ${config.TABLE_SUB_PRODUCTO}.subProducto , ${config.TABLE_SUB_PRODUCTO}.foto , ${config.TABLE_SUB_PRODUCTO}.precioUnidad
            FROM ${config.TABLE_PRODUCTOSVENTA}
                LEFT JOIN ${config.TABLE_PRODUCTO} ON ${config.TABLE_PRODUCTO}.idProducto = ${config.TABLE_PRODUCTOSVENTA}.idProducto
                    LEFT JOIN ${config.TABLE_SUB_PRODUCTO} ON ${config.TABLE_SUB_PRODUCTO}.idSubProducto = ${config.TABLE_PRODUCTOSVENTA}.idSubProducto WHERE idProductosVenta = ${id};`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_PRODUCTOSVENTA}(0,${body.idVenta},${body.cantidad},${body.idSubProducto})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_PRODUCTOSVENTA}(${id},${body.idVenta},${body.cantidad},${body.idSubProducto})`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_PRODUCTOSVENTA_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = ProductosVentasModel;