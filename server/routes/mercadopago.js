const express = require('express');
const app = express();
const MercadoPagoService = require('../services/MercadoPago');

app.post('/mercadopago',async(req,res,next)=>{
    const mercadopago = new MercadoPagoService();
    const response = await mercadopago.init([{
        "title": "Dummy Item",
        "description": "Multicolor Item",
        "quantity": 1,
        "currency_id": "[FAKER][CURRENCY][ACRONYM]",
        "unit_price": 10.0
    }]);
    res.status(200).json({
        info:response
    })
});

module.exports = app;