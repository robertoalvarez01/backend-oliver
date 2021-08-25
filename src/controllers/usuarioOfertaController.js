const UsuarioOFertaModel = require('../models/UsuarioOferta');
const NodeMailer = require('../services/Nodemailer');

exports.registrarUsuario = async(req,res)=>{
    try {
        const {body} = req;
        const usuarioOferta = new UsuarioOFertaModel();
        await usuarioOferta.create(body);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.enviarOferta = async(req,res)=>{
    const {asunto,contenido} = req.body;
    if(!asunto || !contenido){
        res.status(500).json({ok:false,msg:'Falta de parametros'});
        return;
    }

    try {
        //obtener destinatarios
        const usuarioOferta = new UsuarioOFertaModel();
        const usuarios = await usuarioOferta.getAll();
        if(!usuarios){
            res.status(500).json({ok:false,msg:'No hay usuarios para enviar ofertas'});
            return;
        }

        //instanciar nodemailer
        const nodemailer = new NodeMailer();

        //recorrer array de usuarios para enviar email a cada direccion registrada
        let msg = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            subject:asunto,
            text:contenido
        };
        usuarios.forEach(async user=>{
            msg.to = user.mail;
            await nodemailer.send(msg);
        });
        res.status(200).json({ok:true,msg:'Email enviado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:error.message})
    }
}

exports.obtenerUsuariosRegistrados = async(req,res)=>{
    try {
        const usuarioOferta = new UsuarioOFertaModel();
        const response = await usuarioOferta.getAll();
        res.status(200).json({
            ok:true,
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

exports.detalleUsuario = async(req,res)=>{
    try {
        const {id} = req.params;
        const usuarioOferta = new UsuarioOFertaModel();
        const response = await usuarioOferta.get(id);
        res.status(200).json({
            ok:true,
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}