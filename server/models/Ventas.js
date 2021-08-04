const connection = require('../lib/mysql');
const {config} = require('../config/config');


class VentasModel{

    getAll(){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado, ${config.TABLE_MEDIOS_DE_PAGO}.medio
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                    LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio 
                    LEFT JOIN ${config.TABLE_MEDIOS_DE_PAGO} ON ${config.TABLE_MEDIOS_DE_PAGO}.idMedioPago = ${config.TABLE_VENTAS}.idMedioPago
                        ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    get(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado, ${config.TABLE_MEDIOS_DE_PAGO}.medio
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                    LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio 
                    LEFT JOIN ${config.TABLE_MEDIOS_DE_PAGO} ON ${config.TABLE_MEDIOS_DE_PAGO}.idMedioPago = ${config.TABLE_VENTAS}.idMedioPago
                WHERE ${config.TABLE_VENTAS}.idVenta = ${id} ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    getByEnvio(idEnvio){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT ${config.TABLE_VENTAS}.idVenta, ${config.TABLE_USER}.email, ${config.TABLE_USER}.lat, ${config.TABLE_USER}.lon, ${config.TABLE_USER}.address, ${config.TABLE_USER}.nombre, ${config.TABLE_USER}.foto, ${config.TABLE_VENTAS}.fecha, ${config.TABLE_VENTAS}.subtotal,
            ${config.TABLE_VENTAS}.porcentaje_descuento, ${config.TABLE_VENTAS}.descuento, ${config.TABLE_VENTAS}.total, ${config.TABLE_VENTAS}.pagado, ${config.TABLE_VENTAS}.payment_id, ${config.TABLE_ENVIO}.tipo as tipo_de_envio, ${config.TABLE_ENVIO}.entregado,${config.TABLE_MEDIOS_DE_PAGO}.medio
                FROM ventas
                    LEFT JOIN ${config.TABLE_USER} ON ${config.TABLE_USER}.idUsuario = ${config.TABLE_VENTAS}.idUsuario
                    LEFT JOIN ${config.TABLE_ENVIO} ON ${config.TABLE_ENVIO}.idEnvio = ${config.TABLE_ENVIO}.idEnvio 
                    LEFT JOIN ${config.TABLE_MEDIOS_DE_PAGO} ON ${config.TABLE_MEDIOS_DE_PAGO}.idMedioPago = ${config.TABLE_VENTAS}.idMedioPago
                WHERE ${config.TABLE_VENTAS}.idEnvio = ${idEnvio} ORDER BY ${config.TABLE_VENTAS}.idVenta DESC;`,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    create(body){
        return new Promise(async(resolve,reject)=>{
            //hash para password
            let query = `CALL ${config.SP_VENTAS}(0,${body.idUsuario},'${body.subtotal}','${body.porcentaje_descuento}','${body.descuento}','${body.total}',${body.idEnvio},'${body.collection_id}',${body.idMedioPago},'${body.payment_id}',${body.pagado})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                return connection.query(`SELECT idVenta from ${config.TABLE_VENTAS} order by idVenta DESC limit 1`,(err,res)=>{
                    if(error) return reject(error);
                    resolve(res);
                })
            })
        })
    };

    update(body,id){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_VENTAS}(${id},${body.idUsuario},'${body.subtotal}','${body.porcentaje_descuento}','${config,descuento}','${body.total}',${body.idEnvio},0)`;
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

    getByOperacionId(id){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT 1 FROM ventas WHERE operacion_id = ${id}`,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res)
            })
        })
    }

    cambiarEstadoPago(id){
        return new Promise((resolve,reject)=>{
            connection.query(`CALL ${config.SP_VENTA_PAGADO}(${id})`,(err,res,fields)=>{
                if(err) reject(err);
                resolve(res);
            })
        })
    }

    getCantidadByIdUsuario(idUsuario){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE idUsuario = ${idUsuario}`,(err,res,fields)=>{
                if(err) reject(err);
                resolve(res);
            })
        })
    }

    getVentasByIdUsuario(idUsuario,cantidad=10){
        return new Promise((resolve,reject)=>{
            connection.query(`SELECT idVenta,total,medio_pago,DATE_FORMAT(fecha, "%d-%m-%Y") AS fecha,pagado FROM vw_ventas WHERE idUsuario = ${idUsuario} order by idVenta desc limit ${cantidad}`,(err,res,fields)=>{
                if(err) reject(err);
                resolve(res);
            })
        }) 
    }

}

module.exports = VentasModel;