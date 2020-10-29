const express = require('express');
const app = express();
const MercadoPagoService = require('../services/MercadoPago');

app.post('/mercadopago',async(req,res,next)=>{
    const mercadopago = new MercadoPagoService();
    const response = await mercadopago.init();
    res.status(200).json({
        info:response
    })
});

module.exports = app;