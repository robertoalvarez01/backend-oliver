const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const BannerService = require('../services/BannerService');
const CloudStorage = require('../services/CloudStorage');

// ======================================
// ALTA DE UN BANNER
// ======================================

app.post('/banner', [verificarToken,verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(!req.file){
            return res.status(503).json({error:'Imagen no recibida'});
        }
        const {file:foto} = req;
        const cs = new CloudStorage('banners');
        cs.upload(foto).then(async url=>{
            const bannersevice = new BannerService();
            const response = await bannersevice.create(body,url);
            res.status(200).json({
                info:response
            });
        }).catch(err=>{
            res.status(500).json({error:err.message})
        })
    } catch (error) {
        res.status(500).json({
            error
        })
    }
});

// ======================================
// Actualiza un banner
// ======================================

app.put('/banner/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        const {id} = req.params;
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(req.file){
            const cs = new CloudStorage('banners');
            return cs.upload(req.file).then(async url=>{
                const bannersevice = new BannerService();
                const response = await bannersevice.update(body,id,url);
                return res.status(200).json({
                    info:response
                });
            }).catch(err=>{
                return res.status(400).json({err})
            })
        }
        const bannersevice = new BannerService();
        const response = await bannersevice.update(body,id);
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
// Borra un banner -- (Borrado definitivo)
// ======================================

app.delete('/banner/:id', [verificarToken, verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const bannersevice = new BannerService();
        const response = await bannersevice.delete(id);
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
// Trae todos las banners
// ======================================

app.get('/banners', async(req, res) => {
    try {
        let isAdmin = req.query.admin || false;
        const bannersevice = new BannerService();
        const response = await bannersevice.getAll(isAdmin);
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
// Trae un solo banner
// ======================================

app.get('/banner/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const bannersevice = new BannerService();
        const response = await bannersevice.getOne(id);
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