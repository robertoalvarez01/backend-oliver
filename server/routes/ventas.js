const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const EnvioService = require('../services/EnvioService');
const VentasService = require('../services/VentasService');
const ProductosVentaService = require('../services/ProductosVentaService');
const {config} = require('../config/config');
const NodeMailer = require('../services/Nodemailer');
const UsuarioService = require('../services/UsuarioService');
const qrcode = require('qrcode');

app.post('/registrarVenta',[verificarToken],async(req,res)=>{
    const eService = new EnvioService();
    const vService = new VentasService();
    const pvService = new ProductosVentaService();
    const uService = new UsuarioService();
    try {
        const {envio:dataEnvio,venta:dataVenta} = req.body;
        const {mercadoPago:mercado_pago_params} = req.query;
        if(dataEnvio.tipo==''){
		    return res.status(500).json({ok:false,error:'Datos de envio insuficientes.'});
        }else if(dataVenta.productos.length==0){
            return res.status(500).json({ok:false,error:'No hay productos para registrar de la venta'})
        }else{
            //antes de registrar algo, verifico el id de la operacion para descartar que sea una operacion duplicada
            if(mercado_pago_params){
                const verificarOperacion = await vService.verificarVentaDuplicada(dataVenta.operacion_id);
                if(verificarOperacion.length>0){
                    return res.status(500).json({ok:false,info:'Ha ocurrido un error con la operación, lo sentimos mucho.'})
                }
            }

            
            const newEnvio = await eService.create(dataEnvio);
            const {idEnvio:idUltimoEnvio} = newEnvio[0];
            
            //creo y guardo qr en tabla
            const qr = await qrcode.toDataURL(`${idUltimoEnvio}`);
            await eService.setQrCode(idUltimoEnvio,qr);

            //asigno idEnvio al objeto de dataVenta
            dataVenta.idEnvio = idUltimoEnvio;
            if(mercado_pago_params=="true"){
                dataVenta.pagado = 1;
            }else{
                dataVenta.pagado = 0;
            }
            const newVenta = await vService.create(dataVenta);
            
            const {idVenta:idUltimaVenta} = newVenta[0];
            await pvService.create(dataVenta.productos,idUltimaVenta);

            //envio de email a usuario
            const dataUsuario = await uService.getOne(dataVenta.idUsuario);
            const {email,nombre} = dataUsuario[0];
            const nodemailer = new NodeMailer();
            let html = `
            <p>Hola, <b>${nombre}</b></p>
            <br/>
            <p>Hemos recibido la informacion de tu compra.</p>`;

            if(mercado_pago_params){
                html += `
                <br/>
                <p>Para poder retirar tu compra, acercate a nuestro local y presentá el codigo de la compra que se muestra continuación.</p>
                <br/>
                <p>Código de compra: <b>${idUltimoEnvio}</b></p>`;
            }else{
                html += `<p>en breve te informaremos cuando el envio este en camino</p>`;
            }

            html += `<br/>
            <b>OLIVER PETSHOP</b>`

            const mailOptions = {
                from:`Oliver PETSHOP <${config.ACCOUNT_USERNAME}>`,
                to:`${email}`,
                cc:`${config.ACCOUNT_USERNAME}`,
                subject:'Nueva compra en PetShop Oliver',
                html
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

app.put('/ventas/modificarEstadoPago/:id',[verificarToken,verificarAdmin_role],async(req,res)=>{
    const {id} = req.params;
    const vService = new VentasService();
    try {
        const response = await vService.cambiarEstadoPago(id);
        res.status(200).json({
            ok:true,
            info:response
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            info:error.message
        })
    }
})

module.exports = app;
