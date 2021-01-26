const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const EnvioService = require('../services/EnvioService');
const VentasService = require('../services/VentasService');
const ProductosVentaService = require('../services/ProductosVentaService');

app.get('/envios',[verificarToken,verificarAdmin_role],async(req,res)=>{
    const eService = new EnvioService();
    const vService = new VentasService();
    const pvService = new ProductosVentaService();
    try {
        const envios = await eService.getAll();
        if(!envios.length) return res.status(200).json({ok:true,data:[]});
        let promises = [];

        //recorro array de envios para concatenar la venta correspondiente y a esas ventas, concatenarle sus productos.
        envios.map(env=>{
            const venta = vService.getByEnvio(env.idEnvio).then(async dataVenta=>{//obtengo ventas
                if(dataVenta.length>0){
                    await pvService.getAll(dataVenta[0].idVenta).then(res=>{//obtengo los productos de la venta
                        env.venta=dataVenta[0]
                        env.venta.productos = res
                    });
                }else{
                    env.venta = null;
                }
            })
            promises.push(venta);
        });
        Promise.all(promises).then(()=>{
            return res.status(200).json({
                ok:true,
                data:envios
            })
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
});


app.get('/envios/:id',[verificarToken,verificarAdmin_role],async(req,res)=>{
    const eService = new EnvioService();
    const vService = new VentasService();
    const pvService = new ProductosVentaService();
    try {
        const {id} = req.params;
        const envios = await eService.getOne(id);
        if(!envios.length) return res.status(200).json({ok:true,data:[]});
        let envio = envios[0];
        const venta = await vService.getByEnvio(id);
        const prdVenta = await pvService.getAll(venta[0].idVenta);
        envio.venta = venta[0];
        envio.venta.productos = prdVenta;
        return res.status(200).json({
            ok:true,
            data:envio
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

app.get('/envios/modificarEstado/:id',[verificarToken,verificarAdmin_role],async(req,res)=>{
    const eService = new EnvioService();
    try {
        const {id} = req.params;
        await eService.cambiarEstado(id);
        res.status(200).json({ok:true,info:'Estado del envio modificado'})
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

module.exports = app;
