const express = require('express');
const upload = require('../lib/multer');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const bannerController = require('../controllers/bannerController');

// ======================================
// /banners
// ======================================

app.post('/add', [verificarToken,verificarAdmin_role,upload.single('foto')], bannerController.agregarBanner);

app.put('/update/:id', [verificarToken,verificarAdmin_role,upload.single('foto')], bannerController.modificarBanner);

app.delete('/delete/:id', [verificarToken, verificarAdmin_role], bannerController.eliminarBanner);

app.get('/', bannerController.getAll);

app.get('/:id', bannerController.getById);



module.exports = app;