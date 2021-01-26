const connection = require('../lib/mysql');
const {config} = require('../config/config');


class VentasModel{

    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                        LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                        LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio WHERE ${config.TABLE_VENTAS}.idVenta = ${id} ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    getByEnvio(idEnvio){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                        LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio WHERE ${config.TABLE_VENTAS}.idEnvio = ${idEnvio} ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_VENTAS}(0,${body.idUsuario},'${body.fecha}','${body.subtotal}','${body.porcentaje_descuento}','${config,descuento}','${body.total}',${body.idEnvio})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_VENTAS}(${id},${body.idUsuario},'${body.fecha}','${body.subtotal}','${body.porcentaje_descuento}','${config,descuento}','${body.total}',${body.idEnvio})`;
            connection.query(query,(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    };

    delete(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_VENTAS_DELETE}(${id})`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }
}

module.exports = VentasModel;