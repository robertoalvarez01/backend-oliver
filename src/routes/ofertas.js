const express = require('express');
const app = express();
const ofertasController = require('../controllers/ofertasController');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const upload = require('../lib/multer');

//desde api/ofertas

app.get('/',ofertasController.gelAll);

app.get('/:id',ofertasController.getOne);

app.post('/agregarProducto/:idOferta',verificarToken,verificarAdmin_role,ofertasController.agregarProducto);

app.post('/',verificarToken,verificarAdmin_role,upload.single('foto'),ofertasController.create);

app.put('/:id',upload.single('foto'),verificarToken,verificarAdmin_role,ofertasController.update);

app.delete('/eliminarProducto/:id',verificarToken,verificarAdmin_role,ofertasController.quitarProducto);

app.delete('/:id',verificarToken,verificarAdmin_role,ofertasController.delete);



module.exports = app;