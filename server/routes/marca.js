const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const Marca = require('../models/marca');


// ======================================
// Crea una Marca
// ======================================

app.post('/marca', [verificarToken, verificarAdmin_role], (req, res) => {
    let id = req.usuario._id;
    let body = req.body;

    let marca = new Marca({
        descripcion: body.descripcion,
        usuario: id
    });

    marca.save((err, marcaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            marca: marcaDB
        });
    });
});

// ======================================
// Actualiza una categoria
// ======================================

app.put('/marca/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// ======================================
// Borra una categoria -- (Borrado definitivo)
// ======================================

app.delete('/marca/:id', [verificarToken, verificarAdmin_role], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (categoriaBorrada === null) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });
});

// ======================================
// Trae todas las categorias
// ======================================

app.get('/marca', [verificarToken, verificarAdmin_role], (req, res) => {
    Marca.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, marcas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Marca.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    marcas,
                    cantidad: conteo
                });
            })
        })
});

// ======================================
// Trae una sola categoria
// ======================================

app.get('/marca/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findOne({ _id: id }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});



module.exports = app;