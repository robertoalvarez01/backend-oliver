const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
//const {config} = require('../config/config');
const enviosController = require('../controllers/enviosController');

// DESDE -> API.OLIVERPETSHOP.COM.AR/ENVIOS

app.get('/',[verificarToken,verificarAdmin_role],enviosController.getAll);

app.get('/:id',[verificarToken,verificarAdmin_role],enviosController.getById);

app.put('/modificarEstadoEnCamino/:id',[verificarToken,verificarAdmin_role],enviosController.enCamino);

app.put('/modificarEstadoEntregado/:id',[verificarToken,verificarAdmin_role],enviosController.entregado);


module.exports = app;
