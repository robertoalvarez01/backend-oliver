const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

const _ = require('underscore');

// ======================================
// Insertar nuevo Producto
// ======================================

app.post('/producto', [verificarToken, verificarAdmin_role], (req, res) => {
    let body = req.body;
    let id = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcionBasica: body.descripcionBasica,
        disponible: body.disponible,
        categoria: body.categoria,
        marca: body.marca,
        descripcion: body.descripcion,
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

app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

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

app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findOneAndUpdate(id, { disponible: false }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
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
    })
});


// ======================================
// Listar productos (Paginados)
// ======================================

app.get('/producto', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .populate('marca', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ disponible: true }, (err, conteo) => {
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

app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .populate('marca', 'descripcion')
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

app.get('/producto/buscar/:busqueda', verificarToken, (req, res) => {
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



module.exports = app;