const BalanceModel = require('../models/Balance');

exports.getEstadisticas = async(req,res)=>{
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
}

exports.getUltimasVentas = async(req,res)=>{
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
}

exports.ventasSegunMedioDePago = async(req,res)=>{
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
}

exports.informeRecaudacion = async(req,res)=>{
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
    try {
        res.status(200).json({
            ok:true
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}