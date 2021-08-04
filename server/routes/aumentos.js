const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const aumentosController = require('../controllers/aumentosController');

// api/aumentos

app.put('/subproducto/marca', [verificarToken,verificarAdmin_role], aumentosController.auentarPorMarca);
