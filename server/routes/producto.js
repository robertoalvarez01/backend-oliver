const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const productosController = require('../controllers/productosController');


// ======================================
// api/productos
// ======================================

app.post('/add', [verificarToken, verificarAdmin_role], productosController.create);

app.put('/update/:id', [verificarToken,verificarAdmin_role], productosController.update);

app.delete('/delete/:id', verificarToken, productosController.delete);

app.get('/', productosController.getAll);

app.get('/:id', productosController.getById);

app.get('/buscar', productosController.buscar);

app.get('/filtro/filtrar',productosController.filtrar)


module.exports = app;