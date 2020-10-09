const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const SubCategoriaService = require('../services/SubCategoriaService');


// ======================================
// Crea una categoria
// ======================================

app.post('/subcategoria', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const subcategoria = new SubCategoriaService();
        const response = await subcategoria.create(body);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            error
        })        
    }
});

// ======================================
// Actualiza una categoria
// ======================================

app.put('/subcategoria/:id', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        const subcategoria = new SubCategoriaService();
        const response = await subcategoria.update(body,id);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            error
        }) 
    }
});


// ======================================
// Borra una categoria -- (Borrado definitivo)
// ======================================

app.delete('/subcategoria/:id', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const subcategoria = new SubCategoriaService();
        const response = await subcategoria.delete(id);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({
            error
        }) 
    }
});

// ======================================
// Trae todas las categorias
// ======================================

app.get('/subcategoria', async(req, res) => {
    try {
        const subcategoria = new SubCategoriaService();
        const response = await subcategoria.getAll();
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({
            error
        }) 
    }
});

// ======================================
// Trae una sola categoria
// ======================================

app.get('/subcategoria/:id',async(req, res) => {
    try {
        const {id} = req.params;
        const subcategoria = new SubCategoriaService();
        const response = await subcategoria.getOne(id);
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