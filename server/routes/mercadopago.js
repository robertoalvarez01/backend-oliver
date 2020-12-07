const express = require('express');
const app = express();
const MercadoPagoService = require('../services/MercadoPago');

app.post('/mercadopago',async(req,res,next)=>{
    const mercadopago = new MercadoPagoService();
    const response = await mercadopago.init([{
        "title": "Dummy Item",
        "description": "Multicolor Item",
        "quantity": 1,
<<<<<<< HEAD
=======
        "currency_id": "[FAKER][CURRENCY][ACRONYM]",
>>>>>>> cebe0a0f2fef489905eb306f9b90fbda3c69e7d7
        "unit_price": 10.0
    }]);
    res.status(200).json({
        info:response
    })
});

module.exports = app;
