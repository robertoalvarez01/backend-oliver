const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const ventasController = require('../controllers/ventasController');

app.post('/registrarVenta',verificarToken,ventasController.registrarVenta);

//HOOK DONDE MERCADO PAGO NOTIFICA LA APROBACION DEL PAGO
app.post('/hooks/updatePago',async(req,res)=>{
    // const vService = VentasService();
    // const eService = EnvioService();
    // const {data:{id:idPago},action} = req.body;
    console.log(req.body);
    return res.status(200).json({
        ok:true
    });
})

app.put('/modificarEstadoPago/:id',[verificarToken,verificarAdmin_role], ventasController.modificarEstadoDelPago);

app.get('/usuario/:idUsuario',verificarToken,ventasController.obtenerVentasDelUsuario);

module.exports = app;
