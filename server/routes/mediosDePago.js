const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const mediosDePagoController = require('../controllers/mediosDePagoController');


app.post('/', [verificarToken,verificarAdmin_role], mediosDePagoController.create);

app.put('/:id', [verificarToken,verificarAdmin_role], mediosDePagoController.update);

app.delete('/:id', [verificarToken, verificarAdmin_role], mediosDePagoController.delete);

app.get('/', [verificarToken],mediosDePagoController.getAll);

app.get('/:id', mediosDePagoController.getById);


module.exports = app;