const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const upload = require('../lib/multer');
const marcasController = require('../controllers/marcasController');


//DESDE URL/marcas

// ======================================
// Crea una Marca
// ======================================

app.post('/', [verificarToken, verificarAdmin_role,upload.single('imagen')], marcasController.create);

// ======================================
// Actualiza una categoria
// ======================================

app.put('/:id', [verificarToken, verificarAdmin_role,upload.single('imagen')], marcasController.update);


// ======================================
// Borra una categoria -- (Borrado definitivo)
// ======================================

app.delete('/:id', [verificarToken, verificarAdmin_role], marcasController.delete);

// ======================================
// Trae todas las categorias
// ======================================

app.get('/', marcasController.getAll);

// ======================================
// Trae una sola categoria
// ======================================

app.get('/:id', marcasController.getById);



module.exports = app;