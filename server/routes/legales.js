const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const LegalesService = require('../services/LegalesService');


app.post('/legales', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const legalesService = new LegalesService();
        const response = await legalesService.create(body);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

app.put('/legales', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const legalesService = new LegalesService();
        const response = await legalesService.update(body);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});


app.get('/legales', async(req, res) => {
    try {
        const legalesService = new LegalesService();
        const response = await legalesService.get();
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});



module.exports = app;