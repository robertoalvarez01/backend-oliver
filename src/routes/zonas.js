const express = require('express');
const app = express();
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const zonasController = require('../controllers/zonasController');

app.get('/',verificarToken, zonasController.getAll);

app.get('/:id',verificarToken,zonasController.getById);

app.post('/add',[verificarToken,verificarAdmin_role],zonasController.create);

app.put('/update/:id',[verificarToken,verificarAdmin_role],zonasController.update);

app.delete('/delete/:id',[verificarToken,verificarAdmin_role], zonasController.delete);

module.exports = app;