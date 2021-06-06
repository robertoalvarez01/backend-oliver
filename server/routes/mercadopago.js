const express = require('express');
const app = express();
const MercadoPagoService = require('../services/MercadoPago');
const { verificarToken } = require('../middlewares/autenticacion');

app.post('/mercadopago/nueva-venta',verificarToken,async(req,res,next)=>{
    const {body} = req;
    try {
        const mp = new MercadoPagoService();
        const response = await mp.nuevaTransaccion(body);
        res.status(200).json({
            ok:true,
            info:response
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
});

module.exports = app;
