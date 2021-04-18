const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const {config} = require('../config/config');
const app = express();
const ProductoService = require('../services/ProductoService');
const SubProductoService = require('../services/SubProductoService');


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
        console.log(error);
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
        let isAdmin = req.query.admin || false;
        const productoservice = new ProductoService();
        const subproductoService = new SubProductoService();
        const data = await productoservice.getAll(desde,limite,isAdmin);
        //guardo cada promesa para obtener la foto,peso y precio de un subproducto de cada producto.
        let promesas = [];
        data.map( res => {
            //llamo al metodo que me trae los subproductos a partir de un producto determinado
            const datasubprd = subproductoService.getByIdProducto(res.idProducto,isAdmin).then(result=>{
                if(result.length>0){
                    res.foto = result[0].foto;
                    res.peso = result[0].peso;
                    res.precioUnidad = result[0].precioUnidad;
                    res.precioFinal = result[0].precioFinal;
                }else{
                    res.foto = config.DEFAULT_FOTO;
                    res.peso = null;
                    res.precioFinal = 0;
                };
            });
            promesas.push(datasubprd);
        });
        Promise.all(promesas).then(()=>{
            res.status(200).json({
                data
            })
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
        const subproductoService = new SubProductoService();
        const data = await productoservice.getOne(id);
        let isAdmin = req.query.admin || false;
        if(data.length>0){
            const subproductos = await subproductoService.getByIdProducto(data[0].idProducto,false,isAdmin);
            res.status(200).json({
                data,
                subproductos
            })
        }
        return res.status(200).json({
            info:'ID Inexistente'
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
        let isAdmin = req.query.admin || false;
        busqueda = busqueda.toLowerCase();
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        const productoservice = new ProductoService();
        const subproductoService = new SubProductoService();
        const data = await productoservice.search(desde,limite,busqueda,isAdmin);
        let promesas = [];
        data.map(res=>{
            const datasubprd = subproductoService.getByIdProducto(res.idProducto,true,isAdmin).then(result=>{
                if(result.length>0){
                    res.foto = result[0].foto;
                    res.peso = result[0].peso;
                    res.precioUnidad = result[0].precioUnidad;
                    res.precioFinal = result[0].precioFinal;
                }else{
                    res.foto = config.DEFAULT_FOTO;
                    res.peso = null;
                    res.precioFinal = 0;
                };
            });
            promesas.push(datasubprd);
        });
        Promise.all(promesas).then(()=>{
            res.status(200).json({
                data
            })
        })
    } catch (error) {
        res.status(500).json({
            error
        })       
    }
});

app.get('/productos/filtro/filtrar',async(req,res)=>{
    try {
        let idCategoria = req.query.categoria || null;
        let idSubcategoria = req.query.subcategoria || null;
        let idMarca = req.query.marca || null;
        let desde = req.query.desde || 0;
        let limite = req.query.limite || 50;
        const productoService = new ProductoService();
        const subproductoService = new SubProductoService();
        if(idCategoria || idSubcategoria || idMarca){
            let promesas = [];
            const response = await productoService.filtrar(idCategoria,idSubcategoria,idMarca,desde,limite);
            response.map(res=>{
                const datasubprd = subproductoService.getByIdProducto(res.idProducto,true,false).then(result=>{
                    if(result.length>0){
                        res.foto = result[0].foto;
                        res.peso = result[0].peso;
                        res.precioUnidad = result[0].precioUnidad;
                        res.precioFinal = result[0].precioFinal;
                    }else{
                        res.foto = config.DEFAULT_FOTO;
                        res.peso = null;
                        res.precioFinal = 0;
                    };
                });
                promesas.push(datasubprd);
            });
            Promise.all(promesas).then(()=>{
                res.status(200).json({
                    data:response,
                    info:'Productos filtrados'
                })
            })
        }else{
            res.status(400).json({
                info:'Ningun dato recibido'
            })
        }
    } catch (error) {
        res.status(500).json({
            error
        })
    }
})


module.exports = app;