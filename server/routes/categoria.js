const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const categoriasController = require('../controllers/categoriasController');

// DESDE -> API.OLIVERPETSHOP.COM.AR/CATEGORIAS

// ======================================
// Crea una categoria
// ======================================

app.post('/add', [verificarToken,verificarAdmin_role,upload.single('foto')], categoriasController.create);

// ======================================
// Actualiza una categoria
// ======================================

app.put('/update/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], categoriasController.update);

// ======================================
// Borra una categoria -- (Borrado definitivo)
// ======================================

app.delete('/delete/:id', [verificarToken, verificarAdmin_role], categoriasController.delete);

// ======================================
// Trae todas las categorias
// ======================================

app.get('/', categoriasController.getAll);

// ======================================
// Trae una sola categoria
// ======================================

app.get('/:id', categoriasController.getById);



module.exports = app;