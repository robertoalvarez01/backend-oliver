const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const usuarioOfertaController = require('../controllers/usuarioOfertaController');

app.post('/add', usuarioOfertaController.registrarUsuario);

app.get('/', usuarioOfertaController.obtenerUsuariosRegistrados);

app.get('/:id', usuarioOfertaController.detalleUsuario);

app.post('/sendToAll',[verificarToken,verificarAdmin_role],usuarioOfertaController.enviarOferta);


module.exports = app;