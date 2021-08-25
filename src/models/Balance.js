const connection = require('../lib/mysql');
//const {config} = require('../config/config');

class BalanceModel{

    traerVentas(fecha=null){
        return new Promise((resolve,reject)=>{
            let query = `SELECT COUNT(*) AS VENTAS FROM vw_ventas WHERE 1 = 1`;
            if(fecha){
                query += ` AND fecha LIKE '${fecha}%'`;
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    traerRecaudacion(fecha=null){
        return new Promise((resolve,reject)=>{
            let query = `SELECT SUM(total) AS TOTAL FROM vw_ventas WHERE 1 = 1`;
            if(fecha){
                query += ` AND fecha LIKE '${fecha}%'`;
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    traerProductosSinStock(){
        return new Promise((resolve,reject)=>{
            let query = `SELECT COUNT(*) AS SIN_STOCK FROM subProducto WHERE stock = 0`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    traerUsuariosNuevos(fecha=null){
        return new Promise((resolve,reject)=>{
            let query = `SELECT COUNT(*) AS USUARIOS FROM usuario WHERE 1 = 1`;
            if(fecha){
                query += ` AND fecha_ins LIKE '${fecha}%'`;
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    traerUltimasVentas(cantidad){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idVenta,
                                nombre,
                                total,
                                foto,
                                pagado
                        FROM vw_ventas ORDER BY idVenta DESC LIMIT ${cantidad}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    ventasPorMedioDePago(fecha = null){
        return new Promise((resolve,reject)=>{
            let query = `SELECT (
                            SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE idMedioPago = 1
                        ) AS mercado_pago,
                        (
                            SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE idMedioPago = 2
                        ) AS efectivo,
                        (
                            SELECT COUNT(*) AS TOTAL FROM vw_ventas
                        ) AS total`;
            if(fecha){
                query = `SELECT (
                    SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE idMedioPago = 1 AND fecha LIKE '${fecha}%'
                ) AS mercado_pago,
                (
                    SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE idMedioPago = 2 AND fecha LIKE '${fecha}%'
                ) AS efectivo,
                (
                    SELECT COUNT(*) AS TOTAL FROM vw_ventas WHERE fecha LIKE '${fecha}%'
                ) AS total`;
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    infoVentasAnual(criterio,year){
        let query = 'SELECT ';
        let operacion = 'COUNT(*)';
        if(criterio == 2){
            operacion = 'SUM(total)';
        }   
        return;
    }

}

module.exports = BalanceModel;