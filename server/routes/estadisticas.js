const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const estadisticasController = require('../controllers/estadisticasController');

app.get('/',verificarToken,verificarAdmin_role,estadisticasController.getEstadisticas);

app.get('/ultimas-ventas',verificarToken,verificarAdmin_role, estadisticasController.getUltimasVentas);

app.get('/informes/ventas/medios-de-pago',verificarToken,verificarAdmin_role,estadisticasController.ventasSegunMedioDePago)

app.post('/informes/ventas',verificarToken,verificarAdmin_role,estadisticasController.informeRecaudacion);

module.exports = app;