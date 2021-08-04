const qrcode = require('qrcode');
const NodeMailer = require('../services/Nodemailer');
const EnvioModel = require('../models/Envio');
const VentasModel = require('../models/Ventas');
const ProductosVentasModel = require('../models/ProductosVenta');
const UsuarioModel = require('../models/Usuario');

exports.registrarVenta = async(req,res)=>{
    const {envio:dataEnvio,venta:dataVenta} = req.body;
    if(!dataVenta.productos.length){
        return res.status(400).json({
            ok:false,
            error:'No se puede registrar una venta sin productos'
        })
    }
    if(!dataVenta.idUsuario){
        return res.status(400).json({
            ok:false,
            error:'Usuario invalido'
        });
    }

    try {
        const envioModel = new EnvioModel();
        const ventaModel = new VentasModel();
        const pvModel = new ProductosVentasModel();
        const usuarioModel = new UsuarioModel();

        //LO PRIMERO ES VERIFICAR SI VIENE COLLECTION_ID Y PREGUNTAR SI EXISTE UNA VENTA CON ESE MISMO COLLECTION_ID
        // SI HAY UNA VENTA, RETORNAR UN 400.
        if(dataVenta.collection_id){
            const posiblesVentasDuplicadas = await ventaModel.getByOperacionId(dataVenta.collection_id);
            if(posiblesVentasDuplicadas.length>0){
                return res.status(400).json({
                    ok:false,
                    error:'Ya existe una venta asignada con el identificador que se envió'
                })
            }
        }

        const newEnvio = await envioModel.create(dataEnvio);
        const {idEnvio:idUltimoEnvio} = newEnvio[0];

        //creo y guardo qr en tabla
        const qr = await qrcode.toDataURL(`${idUltimoEnvio}`);
        await envioModel.setQrCode(idUltimoEnvio,qr);

        //asigno idEnvio al objeto de dataVenta
        dataVenta.idEnvio = idUltimoEnvio;

        //si viene el payment_id es porque proviene de mercado pago y esta pago. sino corresponde a una venta en efectivo que el pago no se efectuo aun.
        dataVenta.pagado = dataVenta.payment_id ? 1 : 0;

        //collection_id puede NO venir cuando paga en efectivo. Lo mismo con payment_id
        dataVenta.collection_id = dataVenta.collection_id ? dataVenta.collection_id : null;
        dataVenta.payment_id = dataVenta.payment_id ? dataVenta.payment_id : null;
        
        //guardo la venta
        const newVenta = await ventaModel.create(dataVenta);
        const {idVenta:idUltimaVenta} = newVenta[0];

        //guardo los productos de la venta
        dataVenta.productos.forEach(async prd=>{
            prd.idVenta = idUltimaVenta;
            await pvModel.create(prd);
        })

        //envio de email a usuario
        const nodemailer = new NodeMailer();

        //obtengo email y nombre de usuario comprador.
        const dataUsuario = await usuarioModel.get(dataVenta.idUsuario);
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
        
        await nodemailer.send(mailOptions); 
        res.status(200).json({
            ok:true,
            info:'Venta agregada'
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.modificarEstadoDelPago = async (req,res)=>{
    const {id} = req.params;
    const ventasModel = new VentasModel();
    try {
        await ventasModel.cambiarEstadoPago(id);
        res.status(200).json({
            ok:true
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.obtenerVentasDelUsuario = async (req,res)=>{
    const {params:{idUsuario},body:{cantidad}} = req;
    if(!idUsuario){
        return res.status(400).json({
            ok:false,
            error:'Usuario desconocido'
        })
    }
    try {
        const ventasModel = new VentasModel();
        const pvModel = new ProductosVentasModel();
        const ventasCantidad = await ventasModel.getCantidadByIdUsuario(idUsuario);
        const ventas = await ventasModel.getVentasByIdUsuario(idUsuario,cantidad);
        let promises = [];
        
        ventas.map(async (ven)=>{
            const prds = pvModel.getAll(ven.idVenta).then(prd=>{
                ven.productos = prd;
            });
            promises.push(prds);
        });

        await Promise.all(promises);
        res.status(200).json({
            ok:true,
            info:{
                cantidad_ventas:ventasCantidad[0].TOTAL,
                ventas
            }
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}