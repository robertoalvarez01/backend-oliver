const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/subProducto');

const _ = require('underscore');

// ======================================
// Insertar nuevo Producto
// ======================================

app.post('/subproducto', [verificarToken, verificarAdmin_role], (req, res) => {
    let body = req.body;
    let id = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        peso: body.peso,
        stock: body.stock,
        minimo: body.minimo,
        codigoBarra: body.codigoBarra,
        usuario: id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ======================================
// Modificar Producto
// ======================================

app.put('/subproducto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'codigoBarra', 'stock', 'minimo', 'peso', 'precioUni', 'usuario']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ======================================
// Borrar Producto -- (Desactivarlo)
// ======================================

app.delete('/subproducto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    console.log(id);

    Producto.findByIdAndRemove(id, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (productoBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se ha encontrado ningun producto con ese id'
                }
            });
        }

        res.json({
            ok: true,
            message: `El producto ${productoBorrado.nombre}, ha sido borrado con exito`
        });
    });
});


// ======================================
// Listar productos (Paginados)
// ======================================

app.get('/subproducto', verificarToken, (req, res) => {

    Producto.find()
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    cuantos: conteo
                });
            });
        });
});

// ======================================
// Seleccionar Producto X ID
// ======================================

app.get('/subproducto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                res: productoDB
            });
        });
});

// ======================================
// Busquedas con Expresión Regular
// ======================================

app.get('/subproducto/buscar/:busqueda', verificarToken, (req, res) => {
    let busqueda = req.params.busqueda;

    let regex = new RegExp(busqueda, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre, email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
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