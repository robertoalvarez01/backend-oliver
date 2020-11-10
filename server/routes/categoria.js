const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const CategoriaService = require('../services/CategoriaService');
const CloudStorage = require('../services/CloudStorage');

// ======================================
// Crea una categoria
// ======================================

app.post('/categoria', [verificarToken,verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(!req.file){
            return res.status(503).json({error:'Imagen no recibida'});
        }
        const {file:foto} = req;
        const cs = new CloudStorage('categorias');
        cs.upload(foto).then(async url=>{
            const categoriaservice = new CategoriaService();
            const response = await categoriaservice.create(body,url);
            res.status(200).json({
                info:response
            });
        }).catch(err=>{
            res.status(500).json({err})
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

app.put('/categoria/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(req.file){
            const cs = new CloudStorage('categorias');
            cs.upload(req.file).then(async url=>{
                const categoriaservice = new CategoriaService();
                const response = await categoriaservice.update(body,id,url);
                return res.status(200).json({
                    info:response
                });
            }).catch(err=>{
                return res.status(400).json({err})
            })
        }
        const categoriaservice = new CategoriaService();
        const response = await categoriaservice.update(body,id,null);
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