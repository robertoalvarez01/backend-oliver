const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');

const app = express();
const ProductoService = require('../services/ProductoService');


// ======================================
// Insertar nuevo Producto
// ======================================

app.post('/producto', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const productoservice = new ProductoService();
        const response = await productoservice.create(body);
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
// Modificar Producto
// ======================================

app.put('/producto/:id', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {body} = req;
        const {id} = req.params;
        const productoservice = new ProductoService();
        const response = await productoservice.update(body,id);
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
// Borrar Producto -- (Desactivarlo)
// ======================================

app.delete('/producto/:id', verificarToken, async(req, res) => {
    try {
        const {id} = req.params;
        const productoservice = new ProductoService();
        const response = await productoservice.delete(id);
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
// Listar productos (Paginados)
// ======================================

app.get('/producto', async(req, res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        const productoservice = new ProductoService();
        const data = await productoservice.getAll(desde,limite);
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(500).json({
            error
        })        
    }
});

// ======================================
// Seleccionar Producto X ID
// ======================================

app.get('/producto/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const productoservice = new ProductoService();
        const data = await productoservice.getOne(id);
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(500).json({
            error
        })        
    } 
});

// ======================================
// Busquedas con Expresión Regular
// ======================================

app.get('/productos/buscar', async(req, res) => {
    try {
        let {busqueda} = req.query;
        busqueda = busqueda.toLowerCase();
        const productoservice = new ProductoService();
        const data = await productoservice.search(busqueda);
        res.status(200).json({
            data
        })
    } catch (error) {
        res.status(500).json({
            error
        })       
    }
});



module.exports = app;