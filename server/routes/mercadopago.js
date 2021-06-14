const express = require('express');
const app = express();
const MercadoPagoService = require('../services/MercadoPago');
const { verificarToken } = require('../middlewares/autenticacion');

app.post('/mercadopago',verificarToken,async(req,res,next)=>{
    const {body:productos} = req;
    if(!productos || productos.length==0) return res.status(500).json({
        ok:false,
        info:'Ningun producto recibido'
    });
    try {
        const mercadopago = new MercadoPagoService();
        const response = await mercadopago.init(productos);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
});

module.exports = app;