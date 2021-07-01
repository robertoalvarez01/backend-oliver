const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const BalanceModel = require('../models/Balance');

app.get('/estadisticas',verificarToken,verificarAdmin_role,async(req,res)=>{
    const {fecha} = req.query;
    try {
        const bModel = new BalanceModel();
        const ventas = await bModel.traerVentas(fecha);
        const recaudacion = await bModel.traerRecaudacion(fecha);
        const sinStock = await bModel.traerProductosSinStock();
        const nuevosUsuarios = await bModel.traerUsuariosNuevos(fecha);

        res.status(200).json({
            ok:true,
            info:{
                ventas:ventas[0].VENTAS,
                recaudacion:recaudacion[0].TOTAL,
                sin_stock:sinStock[0].SIN_STOCK,
                nuevos_usuarios:nuevosUsuarios[0].USUARIOS
            },
            parametro:{
                fecha
            }
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
});

app.get('/estadisticas/ultimas-ventas',verificarToken,verificarAdmin_role,async(req,res)=>{
    const {cantidad} = req.query;
    try {
        const bModel = new BalanceModel();
        const ventas = await bModel.traerUltimasVentas(cantidad);
        res.status(200).json({
            ok:true,
            ventas
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
});

app.get('/estadisticas/informes/ventas/medios-de-pago',verificarToken,verificarAdmin_role,async(req,res)=>{
    const {fecha} = req.query;
    try {
        const bModel = new BalanceModel();
        const data = await bModel.ventasPorMedioDePago(fecha);
        res.status(200).json({
            ok:true,
            data
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

app.post('/estadisticas/informes/ventas',verificarToken,verificarAdmin_role,async(req,res)=>{
    // const {operacion,fecha} = req.query;
    // try {
    //     const bModel = new BalanceModel();
    //     //const data = bModel.infoVentasAnual(operacion,fecha);
    //     res.status(200).json({
    //         ok:true,
    //         data
    //     })
    // } catch (error) {
    //     res.status(500).json({
    //         ok:false,
    //         error:error.message
    //     })
    // }
    res.status(200).json({
        ok:true
    })
})

module.exports = app;