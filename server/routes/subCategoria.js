const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const subCategoriaController = require('../controllers/subCategoriaController');


// ======================================
// api/subcategorias
// ======================================

app.post('/add', [verificarToken,verificarAdmin_role], subCategoriaController.create);

app.put('/update/:id', [verificarToken,verificarAdmin_role], subCategoriaController.update);

app.delete('/delete/:id', [verificarToken, verificarAdmin_role], subCategoriaController.delete);

app.get('/', subCategoriaController.getAll);

app.get('/:id',subCategoriaController.getById);


module.exports = app;