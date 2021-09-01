const connection = require('../lib/mysql');
const {config} = require('../config/config');

class SubProductoModel{
    getAll(desde,limite,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,producto,subProducto,codigoBarra,stock,minStock,
            peso,tamaño,subprd.precioUnidad,foto,marca,prd.idMarca,descuento,precioFinal
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, 
                        ${config.TABLE_TAM} as tm, ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño
                        AND mk.idMarca = prd.idMarca `;

            if(!isAdmin){
                query += "AND subprd.mostrar = 1 ";
            }
            query += `ORDER BY idSubProducto DESC LIMIT ${desde},${limite}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    // getProductoLocal(){
    //     return new Promise((resolve,reject)=>{
    //         let query = `SELECT prd.stock_local_1,prd.producto, subprd.subProducto,subprd.idSubProducto from oliver.productos as prd
    //         inner join oliver_web.subProducto as subprd on subprd.codigoBarra = prd.codigo_producto`;
    //         connection.query(query,(err,res,fields)=>{
    //             if(err) return reject(err);
    //             resolve(res);
    //         })
    //     })
    // }
    // getNoRelacionados(){
    //     return new Promise((resolve,reject)=>{
    //         let query = `SELECT subProducto,stock,codigoBarra from subProducto where idSubProducto not in (
    //             1059,1060,1061,1062,1065,1069,1073,1074,1075,1076,1077,1078,1079,1082,1083,1084,1086,
    //             1088,1089,1094,1095,1096,1097,1098,1101,1102,1103,1107,1108,1111,1112,1113,1115,1116,
    //             1117,1118,1119,1120,1121,1122,1123,1124,1125,1127,1144,1145,1147,1161,1162,1163,1164,
    //             1165,1167,1168,1169,1170,1172,1175,1176,1177,1178,1185,1186,1187,1191,1193,1194,1196,
    //             1198,1199,1201,1202,1203,1207,1208,1217,1218,1221,1226,1228,1229,1231,1232,1234,1236,
    //             1237,1238,1441,1442,1443,1444,1445,1446,1447,1450,1457,1458,1460,1461,1462,1479,1482,
    //             1483,1486,1487,1488,1489,1490,1492,1494,1495,1616,1618,1626,1627,1633,1635,1636,1638,
    //             1639,1640,2065,2066,2067,2070,2071,2072,2075,2080,2081,2082,2083,2084,2085,2086,2089,
    //             2091,2207,2213,2212,2214,1685,2177,2178,2179,2180,2181,2182,2183,2184,2185,2186,2187,
    //             2188,2189,2190,2191,2192,2193,2194,2195,2196,2197,2198,2199,2200,2201,2202,2203,2204,
    //             2205,2206,1705,1738,1745,1747,1748,1749,1751,1752,1753,1754,1755,1756,1770,1784,1847,
    //             1848,1904,1906,1907,1908,1934,1935,1961,1962,1963,1964,1968,1969,1970,1972,1973,1974,
    //             1977,1978,1980,1983,1984,1986,1987,1988,1989,1990,1991,1993,1994,1995,1996,1998,1999,
    //             2001,2002,2003,2005,2006,2009,2010,2011,2012,2013,2014,2015,2016)`;
    //         connection.query(query,(err,res,fields)=>{
    //             if(err) return reject(err);
    //             resolve(res);
    //         })
    //     })
    // }

    get(id){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subprd.idProducto,producto,descripcion,descripcion_basica,subProducto,codigoBarra,    stock,minStock,peso,subprd.idTamaño,tamaño,subprd.precioUnidad,foto,mk.marca,subprd.mostrar,descuento,precioFinal
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm,${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND mk.idMarca = prd.idMarca AND idSubProducto = ${id}`;
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    getByIdProducto(idProducto,limit,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subProducto,codigoBarra,stock,
                                minStock,peso,subprd.idTamaño,tamaño,subprd.precioUnidad,foto,descuento,precioFinal
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_TAM} as tm
                        WHERE subprd.idTamaño = tm.idTamaño AND subprd.idProducto = ${idProducto} `;
            if(!isAdmin){
                query += `AND subprd.mostrar = 1 `;
            }
            if(limit){
                query+=`LIMIT 1`;
            }
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    getOfertas(desde,limite,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,prd.idProducto,producto,subProducto,codigoBarra,stock,minStock,
            peso,tamaño,subprd.precioUnidad,foto,marca,prd.idMarca,subprd.descuento,precioFinal
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, 
                        ${config.TABLE_TAM} as tm, ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño
                        AND mk.idMarca = prd.idMarca AND descuento > 0 `;

            if(!isAdmin){
                query += "AND subprd.mostrar = 1 ";
            }
            query += `ORDER BY idSubProducto DESC LIMIT ${desde},${limite}`;
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    };

    search(key,isAdmin){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,subProducto,producto,tamaño,peso,stock,foto,mk.marca,precioFinal
                        FROM ${config.TABLE_SUB_PRODUCTO} as subprd, ${config.TABLE_PRODUCTO} as prd, ${config.TABLE_TAM} as tm,
                        ${config.TABLE_MARCA} as mk
                        WHERE subprd.idProducto = prd.idProducto AND subprd.idTamaño = tm.idTamaño AND mk.idMarca = prd.idMarca
                        AND subProducto LIKE '%${key}%'`;
            if (!isAdmin) {
                query += " AND subprd.mostrar = 1 ";
            }
            connection.query(query,(err,results,fields)=>{
                if(err) return reject(err);
                resolve(results);
            })
        })
    }

    filtrar(categoria,subcategoria,marca,desde,limite){
        return new Promise((resolve,reject)=>{
            let query = `SELECT idSubProducto,producto,subProducto,codigoBarra,stock,minStock,
                        peso,tamaño,subprd.precioUnidad,subprd.foto,categoria,prd.idCategoria,marca,prd.idMarca,sc.subcategoria,precioFinal
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
            ${body.stock},${body.minStock},'${body.peso}',${body.idTamaño},'${body.precioUnidad}','${foto}',${body.mostrar},${body.descuento})`;
            connection.query(query,(error,results,fields)=>{
                if(error) return reject(error);
                resolve(results);
            })
        })
    };

    update(body,id,foto){
        return new Promise((resolve,reject)=>{
            let query = `CALL ${config.SP_SUBPRODUCTO}(${id},${body.idProducto},'${body.subProducto}','${body.codigoBarra}',
            ${body.stock},${body.minStock},'${body.peso}',${body.idTamaño},'${body.precioUnidad}','${foto}',${body.mostrar},${body.descuento})`;
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

    aumentarPorIdProductos(valor,listProducts){
        return new Promise((resolve,reject)=>{
            connection.query(`update subProducto set precioUnidad = precioUnidad + ((precioUnidad * ${valor})/100), 
                                                    precioFinal = (precioFinal + ((precioFinal * ${valor})/100)) 
                            WHERE idProducto in (?)`,[listProducts],(error,res,fiels)=>{
                if(error) return reject(error);
                resolve(res);
            })
        })
    }

    restarStockDePagina(idSubProducto,cantidad){
        let query = `UPDATE subProducto SET stock = (stock - ${cantidad}) WHERE idSubProducto = ${idSubProducto}`;
        return new Promise((resolve,reject)=>{
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

    restarStockDelLocal(producto=null,cantidad,codigo=null){
        let query = `UPDATE oliver.productos SET stock_local_1 = (stock_local_1 - ${cantidad})`;
        if(codigo){
            query += ` WHERE oliver.productos.codigo_producto = '${codigo}'`;
        }else{
            query += ` WHERE oliver.productos.producto = '${producto}'`;
        }
        return new Promise((resolve,reject)=>{
            connection.query(query,(err,res,fields)=>{
                if(err) return reject(err);
                resolve(res);
            })
        })
    }

}

module.exports = SubProductoModel;
