const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const upload = require('../lib/multer');
const app = express();
let SubProductoService = require('../services/SubProductoService');


// ======================================
// Insertar nuevo Producto
// ======================================

app.post('/subproducto', [verificarToken, verificarAdmin_role,upload.single('foto')], async(req, res) => {
    try {
        if(!req.file) return res.status(500).json({error:'Ninguna imagen insertada'});
        const {body,file:foto} = req;
        const subproducto = new SubProductoService();
        const response = await subproducto.create(body,foto.filename);
        res.status(200).json({
            info:response
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
        let response;
        if(!req.file){
            response = await subproducto.update(body,id);
        }else{
            const {file:foto} = req;
            response = await subproducto.update(body,id,foto.filename);
        }
        res.status(200).json({
            info:response
        })
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

app.get('/subproducto', async(req, res) => {
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        const subproducto = new SubProductoService();
        const response = await subproducto.getAll(desde,limite);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Seleccionar Producto X ID
// ======================================

app.get('/subproducto/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const subproducto = new SubProductoService();
        const response = await subproducto.getOne(id);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

// ======================================
// Busquedas con Expresión Regular
// ======================================

app.get('/subproductos/buscar', async(req, res) => {
    try {
        let {busqueda} = req.query;
        busqueda = busqueda.toLowerCase();
        const subproducto = new SubProductoService();
        const response = await subproducto.search(busqueda);
        res.status(200).json({
            data:response
        })
    } catch (error) {
        res.status(500).json({error})
    }
});

//-- Integracion con el admin del local --
/*
const axios = require('axios');
async function getUser() {
    try {
        const response = await axios.get('https://local.oliverpetshop.com.ar/backend/relacion-pagina/producto/listarProducto.php');
        //console.log(response.data);
        console.log('La cantidad de productos es --> ', response.data.length);
        response.data.map((product, index) => {
            let producto = new Producto({
                nombre: product.producto,
                stock: product.stock,
                codigoBarra: product.codigo_producto
            });
        
            producto.save((err, productoDB) => {
                if (err) {
                    return console.log('Error en el producto --> ', index, err);
                }
        
                console.log('Se guardo el producto --> ', index);
            });
        })
    } catch (error) {
        console.error(error);
    }
}

getUser();
*/

module.exports = app;