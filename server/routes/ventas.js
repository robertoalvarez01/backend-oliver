const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const EnvioService = require('../services/EnvioService');
const VentasService = require('../services/VentasService');
const ProductosVentaService = require('../services/ProductosVentaService');
const NodeMailer = require('../services/Nodemailer');
const UsuarioService = require('../services/UsuarioService');
const qrcode = require('qrcode');

app.post('/ventas/registrarVenta',verificarToken,async(req,res)=>{
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
        const uService = new UsuarioService();

        //LO PRIMERO ES VERIFICAR SI VIENE COLLECTION_ID Y PREGUNTAR SI EXISTE UNA VENTA CON ESE MISMO COLLECTION_ID
        // SI HAY UNA VENTA, RETORNAR UN 400.
        if(dataVenta.collection_id){
            const posiblesVentasDuplicadas = await vService.getByOperacionId(dataVenta.collection_id);
            if(posiblesVentasDuplicadas.length>0){
                return res.status(400).json({
                    ok:false,
                    error:'Ya existe una venta asignada con el identificador que se envió'
                })
            }
        }

        const newEnvio = await eService.create(dataEnvio);
        const {idEnvio:idUltimoEnvio} = newEnvio[0];

        //creo y guardo qr en tabla
        const qr = await qrcode.toDataURL(`${idUltimoEnvio}`);
        await eService.setQrCode(idUltimoEnvio,qr);

        //asigno idEnvio al objeto de dataVenta
        dataVenta.idEnvio = idUltimoEnvio;

        //si viene el payment_id es porque proviene de mercado pago y esta pago. sino corresponde a una venta en efectivo que el pago no se efectuo aun.
        dataVenta.pagado = dataVenta.payment_id ? 1 : 0;

        //collection_id puede NO venir cuando paga en efectivo. Lo mismo con payment_id
        dataVenta.collection_id = dataVenta.collection_id ? dataVenta.collection_id : null;
        dataVenta.payment_id = dataVenta.payment_id ? dataVenta.payment_id : null;
        
        //guardo la venta
        const newVenta = await vService.create(dataVenta);
        
        const {idVenta:idUltimaVenta} = newVenta[0];

        //guardo los productos de la venta
        await pvService.create(dataVenta.productos,idUltimaVenta);



        //envio de email a usuario
        const nodemailer = new NodeMailer();

        //obtengo email y nombre de usuario comprador.
        const dataUsuario = await uService.getOne(dataVenta.idUsuario);
        const {email,nombre} = dataUsuario[0];

        const mensaje = nodemailer.armarBody({
            nombre,
            email,
            productos:dataVenta.productos,
            tipoEnvio:dataEnvio.tipo,
            idUltimoEnvio
        });

        const mailOptions = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            to:`${email}`,
            cc:`petshop-oliver@hotmail.com`,
            subject:'Nueva compra en PetShop Oliver',
            html:mensaje,
            attachments:[
                {
                    filename:'Perro.png',
                    path:'https://storage.googleapis.com/web-oliver/static/Perro.png',
                    cid:"OliverPetShop"
                }
            ]
        };
        nodemailer.send(mailOptions).then(result=>{
            res.status(200).json({
                ok:true,
                info:'Venta agregada'
            })
        }).catch(err=>{
            res.status(500).json({ok:false,error:err})
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
})

//HOOK DONDE MERCADO PAGO NOTIFICA LA APROBACION DEL PAGO
app.post('/ventas/hooks/updatePago',async(req,res)=>{
    // const vService = VentasService();
    // const eService = EnvioService();
    // const {data:{id:idPago},action} = req.body;
    console.log(req.body);
    return res.status(200).json({
        ok:true
    });
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
