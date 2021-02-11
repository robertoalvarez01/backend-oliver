const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const MedioDePagoService = require('../services/MedioDePagoService');

// ======================================
// Crea un medio
// ======================================

app.post('/medioDePago', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const mservice = new MedioDePagoService();
        const response = await mservice.create(body);
        res.status(200).json({
            info:response
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

// ======================================
// Actualiza un medio
// ======================================

app.put('/medioDePago/:id', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        const mservice = new MedioDePagoService();
        const response = await mservice.update(body,id);
        return res.status(200).json({
            info:response
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});


// ======================================
// Borra una medio -- (Borrado definitivo)
// ======================================

app.delete('/medioDePago/:id', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const mservice = new MedioDePagoService();
        const response = await mservice.delete(id);
        res.status(200).json({
            info:response
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

// ======================================
// Trae todos los medios
// ======================================

app.get('/mediosDePago', [verificarToken],async(req, res) => {
    try {
        const mservice = new MedioDePagoService();
        const response = await mservice.getAll();
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

// ======================================
// Trae un solo medio
// ======================================

app.get('/mediosDePago/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const mservice = new MedioDePagoService();
        const response = await mservice.getOne(id);
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});



module.exports = app;