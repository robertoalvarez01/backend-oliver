const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const TamañoService = require('../services/TamañoService');


// ======================================
// Crea un tamaño
// ======================================

app.post(`/${encodeURIComponent('tamaño')}`, [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const tamañoservice = new TamañoService();
        const response = await tamañoservice.create(body);
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
// Actualiza un tamaño
// ======================================

app.put(`/${encodeURIComponent('tamaño')}/:id`, [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        const tamañoservice = new TamañoService();
        const response = await tamañoservice.update(body,id);
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
// Borra un tamaño -- (Borrado definitivo)
// ======================================

app.delete(`/${encodeURIComponent('tamaño')}/:id`, [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const tamañoservice = new TamañoService();
        const response = await tamañoservice.delete(id);
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
// Trae todos los tamaños
// ======================================

app.get(`/${encodeURIComponent('tamaños')}`, async(req, res) => {
    try {
        const tamañoservice = new TamañoService();
        const response = await tamañoservice.getAll();
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
// Trae un solo tamaño
// ======================================

app.get(`/${encodeURIComponent('tamaños')}/:id`, async(req, res) => {
    try {
        const {id} = req.params;
        const tamañoservice = new TamañoService();
        const response = await tamañoservice.getOne(id);
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