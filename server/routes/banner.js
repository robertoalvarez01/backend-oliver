const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const bannerController = require('../controllers/bannerController');

// ======================================
// /banners
// ======================================

app.post('/', [verificarToken,verificarAdmin_role,upload.single('foto')], bannerController.agregarBanner);

app.put('/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], bannerController.modificarBanner);

app.delete('/:id', [verificarToken, verificarAdmin_role], bannerController.eliminarBanner);

app.get('/', bannerController.getAll);

app.get('/:id', bannerController.getById);



module.exports = app;