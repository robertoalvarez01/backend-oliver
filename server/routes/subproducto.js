const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const upload = require('../lib/multer');
const app = express();
const subProductoController = require('../controllers/subProductoController');

// ======================================
// api/subproductos
// ======================================

app.post('/', [verificarToken, verificarAdmin_role,upload.single('foto')], subProductoController.create);

app.put('/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], subProductoController.update);

app.delete('/:id', [verificarToken,verificarAdmin_role], subProductoController.delete);

app.get('/', [verificarToken,verificarAdmin_role],subProductoController.getAll);

app.get('/:id',[verificarToken,verificarAdmin_role] , subProductoController.getById);

app.get('/buscar',[verificarToken,verificarAdmin_role], subProductoController.buscar);

app.get('/ofertas', subProductoController.getOfertas);

module.exports = app;