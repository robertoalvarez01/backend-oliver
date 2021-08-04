const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const legalesController = require('../controllers/legalesController');


app.post('/', [verificarToken, verificarAdmin_role], legalesController.create);

app.put('/', [verificarToken, verificarAdmin_role], legalesController.update);

app.get('/', legalesController.getInfo);

module.exports = app;