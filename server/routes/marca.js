const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const MarcaService = require('../services/MarcaService');
const upload = require('../lib/multer');


// ======================================
// Crea una Marca
// ======================================

app.post('/marca', [verificarToken, verificarAdmin_role,upload.single('imagen')], async(req, res) => {
    try {
        const {body} = req;
        if(!req.file) return res.status(500).json({error:'No se recibio la imagen de la marca'});
        const {file:imagen} = req;
        console.log(imagen);
        const marcaservice = new MarcaService();
        const response = await marcaservice.create(body,imagen.filename);
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

app.put('/marca/:id', [verificarToken, verificarAdmin_role,upload.single('imagen')], async(req, res) => {
    try {
        const {body} = req;
        const {id} = req.params;
        const marcaservice = new MarcaService();
        let response;
        if(!req.file){
            response = await marcaservice.update(body,id);
        }else{
            const {file:imagen} = req;
            response = await marcaservice.update(body,id,imagen.filename);
        }
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

app.delete('/marca/:id', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const marcaservice = new MarcaService();
        const response = await marcaservice.delete(id);
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

app.get('/marca', async(req, res) => {
    try {
        const marcaservice = new MarcaService();
        const response = await marcaservice.getAll();
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

app.get('/marca/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const marcaservice = new MarcaService();
        const response = await marcaservice.getOne(id);
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