const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const EnvioService = require('../services/EnvioService');
const VentasService = require('../services/VentasService');
const ProductosVentaService = require('../services/ProductosVentaService');
const {config} = require('../config/config');
const NodeMailer = require('../services/Nodemailer');
const UsuarioService = require('../services/UsuarioService');

app.post('/registrarVenta',[verificarToken],async(req,res)=>{
    const eService = new EnvioService();
    const vService = new VentasService();
    const pvService = new ProductosVentaService();
    const uService = new UsuarioService();
    try {
        const {envio:dataEnvio,venta:dataVenta} = req.body;
        if(!dataEnvio.idZona || dataEnvio.tipo==''){
		    return res.status(500).json({ok:false,error:'Datos de envio insuficientes.'});
        }else if(dataVenta.productos.length==0){
            return res.status(500).json({ok:false,error:'No hay productos para registrar de la venta'})
        }else{
            //antes de registrar algo, verifico el id de la operacion para descartar que sea una operacion duplicada
            const verificarOperacion = await vService.verificarVentaDuplicada(dataVenta.operacion_id);
            if(verificarOperacion.length>0){
                return res.status(500).json({ok:false,info:'Ha ocurrido un error con la operación, lo sentimos mucho.'})
            }
            const newEnvio = await eService.create(dataEnvio);
            const {idEnvio:idUltimoEnvio} = newEnvio[0];

            //asigno idEnvio al objeto de dataVenta
            dataVenta.idEnvio = idUltimoEnvio;

            const newVenta = await vService.create(dataVenta);
            const {idVenta:idUltimaVenta} = newVenta[0];
            await pvService.create(dataVenta.productos,idUltimaVenta);

            //envio de email a usuario
            const dataUsuario = await uService.getOne(dataVenta.idUsuario);
            const {email} = dataUsuario[0];
            const nodemailer = new NodeMailer();
            const mailOptions = {
                from:`${config.ACCOUNT_USERNAME}`,
                to:`${email}`,
                subject:'Nueva compra en PetShop Oliver',
                html:`
                    <h1>Hemos recibido la informacion de tu compra, en breve te informaremos cuando el envio este en camino</h1>
    
                    <b>OLIVER PETSHOP</b>
                `
            };
            nodemailer.send(mailOptions).then(result=>{
                return  res.status(200).json({
                    ok:true,
                    info:'Venta agregada'
                })
            }).catch(err=>{
                res.status(500).json({ok:false,error:err})
            });
        }
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

module.exports = app;
