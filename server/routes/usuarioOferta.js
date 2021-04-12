const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const UsuarioOfertaService = require('../services/UsuarioOfertaService');

// ======================================
// ALTA DE UN usuario
// ======================================

app.post('/usuario-oferta', async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.create(body);
        res.status(200).json({
            info:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});
// ======================================
// Trae todos los usuarios
// ======================================

app.get('/usuario-oferta', async(req, res) => {
    try {
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.getAll();
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});

// ======================================
// Trae un solo usuario
// ======================================

app.get('/usuario-oferta/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.getOne(id);
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});



module.exports = app;