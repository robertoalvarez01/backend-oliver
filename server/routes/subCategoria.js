const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/subCategoria');


// ======================================
// Crea una categoria
// ======================================

app.post('/subcategoria', verificarToken, (req, res) => {
    let id = req.usuario._id;
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ======================================
// Actualiza una categoria
// ======================================

app.put('/subcategoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, { descripcion: body.descripcion, categoria: body.categoria }, { new: true, runValidators: true }, (err, categoriaDB) => {
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

app.delete('/subcategoria/:id', [verificarToken, verificarAdmin_role], (req, res) => {
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

app.get('/subcategoria', verificarToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({}, (err, conteo) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categorias,
                    cantidad: conteo
                });
            })
        })
});

// ======================================
// Trae una sola categoria
// ======================================

app.get('/subcategoria/:id', verificarToken, (req, res) => {
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