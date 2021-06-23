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

app.post('/ventas/registrarVenta',[verificarToken],async(req,res)=>{
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
            <p>Hemos recibido la informacion de tu compra: </p><br/>`;

            dataVenta.productos.map(prd=>{
                html += `
                    <b>${prd.subProducto} - por (${prd.cantidad}) unidad/es</b><br/>
                `;
            })
            if(mercado_pago_params && dataEnvio.tipo == 'Local'){
                html += `
                <br/><br/>
                <p>Para poder retirar tu compra, acércate a nuestro local y presentá el código de la compra que se muestra a continuación.</p>
                <br/>
                <p>Código de compra: <b>${idUltimoEnvio}</b></p>`;
            }else{
                html += `<p>En breve te informaremos cuando el envío esté en camino.</p>`;
            }

            html += `<br/><br/>
            <p>Para cualquier consulta, comunicarse a <b>02304347008</b></p>
            Muchas gracias por tu confianza, <b>OLIVER PETSHOP.</b>
            <br/>
            <img src="cid:OliverPetShop" width="50px" height="50px"/>`

            const mailOptions = {
                from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
                to:`${email}`,
                cc:`petshop-oliver@hotmail.com`,
                subject:'Nueva compra en PetShop Oliver',
                html,
                attachments:[
                    {
                        filename:'Perro.png',
                        path:'https://storage.googleapis.com/web-oliver/static/Perro.png',
                        cid:"OliverPetShop"
                    }
                ]
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

app.post('/ventas/preguardar',verificarToken,async(req,res)=>{
    const {envio:dataEnvio,venta:dataVenta,usuario:{idUsuario}} = req.body;
    if(!dataEnvio.idZona){
        return res.status(400).json({
            ok:false,
            error:'Zona invalida'
        })
    }
    if(!dataVenta.productos.length){
        return res.status(400).json({
            ok:false,
            error:'No se puede registrar una venta sin productos'
        })
    }
    if(!idUsuario){
        return res.status(400).json({
            ok:false,
            error:'Usuario invalido'
        });
    }
    try {
        const eService = new EnvioService();
        const vService = new VentasService();
        const pvService = new ProductosVentaService();

        //seteo venta_aprobada en 0 porque el envio no esta confirmado.
        dataEnvio.venta_aprobada = 0;

        const newEnvio = await eService.create(dataEnvio);
        const {idEnvio:idUltimoEnvio} = newEnvio[0];

        //creo y guardo qr en tabla
        const qr = await qrcode.toDataURL(`${idUltimoEnvio}`);
        await eService.setQrCode(idUltimoEnvio,qr);

        //asigno idEnvio al objeto de dataVenta
        dataVenta.idEnvio = idUltimoEnvio;
        dataVenta.pagado = 0;//seteo en 0 porque el pago de la venta se va confirmar en el hook cuando mercado pago aprueba el pago.
        
        const newVenta = await vService.create(dataVenta);
        
        const {idVenta:idUltimaVenta} = newVenta[0];

        //guardo los productos de la venta
        await pvService.create(dataVenta.productos,idUltimaVenta);

        return res.status(200).json({
            ok:true,
            info:{
                idVenta:idUltimaVenta,
                idEnvio:idUltimoEnvio
            }
        })

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

//HOOK DONDE MERCADO PAGO NOTIFICA LA APROBACION DEL PAGO
app.post('/ventas/hooks/updatePago',async(req,res)=>{
    const vService = VentasService();
    const eService = EnvioService();
    const {data:{id:idPago},action} = req.body;
    if(action == "payment.created"){
        const ultimaVenta = await vService.getUltimaVenta(0);//pasarle el valor de pagado. Si es 0 trae la ultima no pagada.
        const {idVenta,idEnvio} = ultimaVenta[0];

        const updateVenta = await vService.aprobarVenta(idVenta,idPago);
        const updateEnvio = await eService.aprobarEnvio(idEnvio);
        res.status(200);
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
