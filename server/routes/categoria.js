const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const CategoriaService = require('../services/CategoriaService');


// ======================================
// Crea una categoria
// ======================================

app.post('/categoria', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.create(body);
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
// Actualiza una categoria
// ======================================

app.put('/categoria/:id', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.update(body,id);
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
// Borra una categoria -- (Borrado definitivo)
// ======================================

app.delete('/categoria/:id', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.delete(id);
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
// Trae todas las categorias
// ======================================

app.get('/categorias', async(req, res) => {
    try {
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.getAll();
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
// Trae una sola categoria
// ======================================

app.get('/categoria/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.getOne(id);
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