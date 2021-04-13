const express = require('express');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const app = express();
const UsuarioOfertaService = require('../services/UsuarioOfertaService');
const NodeMailer = require('../services/Nodemailer');

// ======================================
// ALTA DE UN usuario
// ======================================

app.post('/usuario-oferta', async(req, res) => {
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.create(body);
        res.status(200).json({
            info:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});
// ======================================
// Trae todos los usuarios
// ======================================

app.get('/usuario-oferta', async(req, res) => {
    try {
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.getAll();
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});

// ======================================
// Trae un solo usuario
// ======================================

app.get('/usuario-oferta/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const usuarioOferta = new UsuarioOfertaService();
        const response = await usuarioOferta.getOne(id);
        res.status(200).json({
            data:response
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
});


app.post('/usuario-oferta/sendToAll',[verificarToken,verificarAdmin_role],async(req,res)=>{
    const {asunto,contenido} = req.body;
    if(!asunto || !contenido){
        res.status(500).json({ok:false,msg:'Falta de parametros'});
        return;
    }

    //obtener destinatarios
    const usuarioOferta = new UsuarioOfertaService();
    const usuarios = await usuarioOferta.getAll();
    if(!usuarios){
        res.status(500).json({ok:false,msg:'No hay usuarios para enviar ofertas'});
        return;
    }

    try {
        //instanciar nodemailer
        const nodemailer = new NodeMailer();
    
        //recorrer array de usuarios para enviar email a cada direccion registrada
        let msg = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            subject:asunto,
            text:contenido
        };
        usuarios.forEach(user=>{
            msg.to = user.mail;
            return nodemailer.send(msg).then(res=>{
                return;
            }).catch(err=>{
                console.log(err);
                return;
            })
        });

        return res.status(200).json({ok:true,msg:'Email enviado'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ok:false,msg:error.message})
    }

})


module.exports = app;