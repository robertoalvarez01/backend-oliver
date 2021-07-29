const Nodemailer = require('../services/Nodemailer');
const EnvioModel = require('../models/Envio');
const ProductosVentaModel = require('../models/ProductosVenta');
const VentasModel = require('../models/Ventas');

exports.getAll = async(req,res)=>{
    const eModel = new EnvioModel();
    const mVenta = new VentasModel();
    const mProductosVenta = new ProductosVentaModel();
    try {
        const {idZona,tipo,idEnvio} = req.query;//parametros para filtros
        const envios = await eModel.getAll(idZona,tipo,idEnvio);
        if(!envios.length) return res.status(200).json({ok:true,data:[]});
        let promises = [];

        //recorro array de envios para concatenar la venta correspondiente y a esas ventas, concatenarle sus productos.
        envios.map(env=>{
            const venta = mVenta.get(env.idEnvio).then(async dataVenta=>{//obtengo ventas
                if(dataVenta.length>0){
                    await mProductosVenta.getAll(dataVenta[0].idVenta).then(res=>{//obtengo los productos de la venta
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
}

exports.getById = async(req,res)=>{
    const eModel = new EnvioModel();
    const mVenta = new VentasModel();
    const mProductosVenta = new ProductosVentaModel();
    try {
        const {id} = req.params;
        const envios = await eModel.get(id);
        if(!envios.length) return res.status(200).json({ok:true,data:[]});
        let envio = envios[0];
        const venta = await mVenta.getByEnvio(id);
        const prdVenta = await mProductosVenta.getAll(venta[0].idVenta);
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
}

exports.enCamino = async(req,res)=>{
    const eModel = new EnvioModel();
    const nodemailer = new Nodemailer();
    try {
        const {id} = req.params;
        const {email} = req.query;
        await eModel.cambiarEstadoEnCamino(id);
        const mailOptions = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            to:`${email}`,
            subject:'Envío en camino',
            html:`
                <h1>Tu envío ya esta en camino!</h1>

                <b>OLIVER PETSHOP</b>
            `
        };
        await nodemailer.send(mailOptions);
        return res.status(200).json({ok:true,info:'Estado del envio modificado'})
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.entregado = async(req,res)=>{
    const eModel = new EnvioModel();
    const nodemailer = new Nodemailer();
    try {
        const {id} = req.params;
        const {email} = req.query;
        await eModel.cambiarEstadoEntregado(id);
        const mailOptions = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            to:`${email}`,
            subject:'Envío entregado',
            html:`
                <h1>Hemos entregado su compra satisfactoriamente</h1>
        
                <b>OLIVER PETSHOP</b>
            `
        };
        await nodemailer.send(mailOptions);
        return res.status(200).json({ok:true,info:'Estado del envio modificado'})
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}
