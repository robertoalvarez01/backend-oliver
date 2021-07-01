const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const upload = require('../lib/multer');
const app = express();
const ProductoService = require('../services/ProductoService');
const SubProductoService = require('../services/SubProductoService');
const CloudStorage = require('../services/CloudStorage');

// ======================================
// Insertar nuevo Producto
// ======================================

app.post('/subproducto', [verificarToken, verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        if(!req.file) return res.status(500).json({error:'Ninguna imagen insertada'});
        const {body,file:foto} = req;
        const cs = new CloudStorage();
        cs.upload(foto).then(async url=>{
            const subproducto = new SubProductoService();
            const response = await subproducto.create(body,url);
            res.status(200).json({
                info:response
            })
        }).catch(err=>{
            res.status(500).json({err})
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Modificar Producto
// ======================================

app.put('/subproducto/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        const {body,params:{id}} = req;
        const subproducto = new SubProductoService();
        if(!req.file){
            const response = await subproducto.update(body,id);
            res.status(200).json({
                info:response
            })
        }else{
            const {file:foto} = req;
            const cs = new CloudStorage();
            cs.upload(foto).then(async url=>{
                const subproducto = new SubProductoService();
                const response = await subproducto.update(body,id,url);
                res.status(200).json({
                    info:response
                })
            }).catch(err=>{
                res.status(500).json({err})
            })
        }
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Borrar Producto -- (Desactivarlo)
// ======================================

app.delete('/subproducto/:id', [verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        const {id} = req.params;
        const subproducto = new SubProductoService();
        const response = await subproducto.delete(id);
        res.status(200).json({
            info:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});


// ======================================
// Listar productos (Paginados)
// ======================================

app.get('/subproducto', [verificarToken,verificarAdmin_role],async(req, res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoService();
        const response = await subproducto.getAll(desde,limite,isAdmin);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Seleccionar SubProducto X ID
// ======================================

app.get('/subproducto/:id',[verificarToken,verificarAdmin_role] ,async(req, res) => {
    try {
        const {id} = req.params;
        const subproducto = new SubProductoService();
        const response = await subproducto.getOne(id);
        if(response.length>0){
            return res.status(200).json({
                data:response
            })
        }
        return res.status(200).json({
            info:'ID inexistente'
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Busquedas con Expresión Regular
// ======================================

app.get('/subproductos/buscar',[verificarToken,verificarAdmin_role], async(req, res) => {
    try {
        let {busqueda} = req.query;
        busqueda = busqueda.toLowerCase();
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoService();
        const response = await subproducto.search(busqueda,isAdmin);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

app.get('/subproductos/ofertas', async(req, res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoService();
        const response = await subproducto.getOfertas(desde,limite,isAdmin);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

//filtros

//esta ruta queda caducada porque ahora se filtra desde productos
app.get('/subproductos/filtrar',[verificarToken,verificarAdmin_role],async(req,res)=>{
    res.status(403).json({
        info:'Ruta vencida'
    })
})

app.put('/aumentos/subproducto/marca', [verificarToken,verificarAdmin_role], async(req, res) => {
    const {body:{idMarca,aumento}} = req;
    if(!idMarca){
        return res.status(400).json({
            ok:false,
            error:'Ninguna marca recibida'
        })
    }
    try {
        const pService = new ProductoService();
        const productos = await pService.getByIdMarca(idMarca);
        if(productos.length == 0){
            return res.status(400).json({
                ok:false,
                error:'No hay productos con esa marca'
            })
        }

        const spService = new SubProductoService();
        let prds = [];
        productos.map(prd=>(prds.push(prd.idProducto)));

        const data = await spService.aumentarPorProductos(aumento,prds);

        res.status(200).json({
            ok:true,
            message:`Se han modificado ${productos.length} productos`,
            info:data
        })

    } catch (error) {
        res.status(500).json({error:error.message})
    }
});

module.exports = app;