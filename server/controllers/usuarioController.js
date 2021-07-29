const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const UsuarioModel = require('../models/Usuario');
const CloudStorage = require('../services/CloudStorage');
const Nodemailer = require('../services/Nodemailer');

exports.getAll = async(req,res)=>{
    try {
        const mUsuario = new UsuarioModel();
        const data = await mUsuario.getAll();
        res.status(200).json({
            data,
            info:'Usuarios Listados'
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.getById = async(req,res)=>{
    try {
        const mUsuario = new UsuarioModel();
        const data = await mUsuario.get(req.params.id);
        res.status(200).json({
            data,
            info:'Usuario listado'
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.create = async(req,res)=>{
    try {
        const mUsuario = new UsuarioModel();
        const {body} = req;
        await mUsuario.register(body,null);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.update = async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req
        const mUsuario = new UsuarioModel();
        await mUsuario.update(body,id);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.updateUserWeb = async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req;
        const mUsuario = new UsuarioModel();
        await mUsuario.updateFromWeb(body,id);
        const updatedUser = await mUsuario.get(id);
        let token = jwt.sign({
            usuario:{
                idUsuario:updatedUser[0].idUsuario,
                email:updatedUser[0].email,
                admin:updatedUser[0].admin
            }
        }, config.seed, { expiresIn: config.caducidad_token });
        await mUsuario.refreshToken(token,updatedUser[0].idUsuario);
        let userDB = {
            email:updatedUser[0].email,
            nombre:updatedUser[0].nombre,
            telefono:updatedUser[0].telefono,
            foto:updatedUser[0].foto,
            address:updatedUser[0].address,
            idUsuario:updatedUser[0].idUsuario,
            token:token,
	        lat:updatedUser[0].lat,
            lon:updatedUser[0].lon
        };
        res.status(200).json({
            ok:true,
            info:response,
            user:userDB
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.updateFotoWeb = async(req,res)=>{
    try {
        const mUsuario = new UsuarioModel();
        const cs = new CloudStorage('usuarios');
        const {id} = req.params;
        if(!req.file) return res.status(503).json({ok:false,error:'No se recibido ninguna imagen'});
        const {file:foto} = req;
        const url = await cs.upload(foto);
        await mUsuario.updateFotoFromWeb(url,id);
        const updatedUser = await mUsuario.get(id);
        let token = jwt.sign({
            usuario:{
                idUsuario:updatedUser[0].idUsuario,
                email:updatedUser[0].email,
                admin:updatedUser[0].admin
            }
        }, config.seed, { expiresIn: config.caducidad_token });

        await mUsuario.refreshToken(token,updatedUser[0].idUsuario);
        let userDB = {
            email:updatedUser[0].email,
            nombre:updatedUser[0].nombre,
            telefono:updatedUser[0].telefono,
            foto:updatedUser[0].foto,
            address:updatedUser[0].address,
            idUsuario:updatedUser[0].idUsuario,
            token:token,
            lat:updatedUser[0].lat,
            lon:updatedUser[0].lon
        };
        return res.status(200).json({
            ok:true,
            user:userDB
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.updateAddress = async(req,res)=>{
    try {
        const {address,lat,lon} = req.body;
        const {id:idUsuario} = req.params;
        if(address=='' || lat == '' || lon == '' || !idUsuario) return res.status(400).json({
            ok:false,
            info:'Datos recibidos no suficientes'
        });
        const mUsuario = new UsuarioModel();
        await mUsuario.updateAddress({address,lat,lon},idUsuario);
        const updatedUser = await mUsuario.get(idUsuario);
        let token = jwt.sign({
            usuario:{
                idUsuario:updatedUser[0].idUsuario,
                email:updatedUser[0].email,
                admin:updatedUser[0].admin
            }
        }, config.seed, { expiresIn: config.caducidad_token });
        await mUsuario.refreshToken(token,updatedUser[0].idUsuario);
        return res.status(200).json({
            ok:true,
            usuario:{
                email:updatedUser[0].email,
                nombre:updatedUser[0].nombre,
                telefono:updatedUser[0].telefono,
                foto:updatedUser[0].foto,
                address:updatedUser[0].address,
                idUsuario:updatedUser[0].idUsuario,
                token:token,
                lat:updatedUser[0].lat,
                lon:updatedUser[0].lon
            }
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.delete = async(req,res)=>{
    try {
        const {id} = req.params;
        const mUsuario = new UsuarioModel();
        await mUsuario.delete(id);
        res.status(200).json({
            ok:true
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.resetPassword = async (req,res) =>{
    const {idUsuario,email} = req.body;
    if(!idUsuario && !email) return res.status(500).json({
        ok:false,
        info:'Datos recibidos insuficientes'
    });
    const mUsuario = new UsuarioModel();
    try {
        //OBTENGO EL USUARIO DE LA DB
        let user = idUsuario ? await mUsuario.get(idUsuario) : await mUsuario.getByEmail(email);
        if(user.length==0 || user.length>1) return res.status(403).json({
            ok:false,
            info:'Operacion no permitida'
        });
        
        //GENERO NUEVO TOKEN PARA GUARDARLO EN DB
        const userDB = user[0];
        let token = jwt.sign({
            usuario:{
                idUsuario:userDB.idUsuario,
                email:userDB.email,
                admin:userDB.admin
            }
        },config.seed, { expiresIn: '10m' });

        //GUARDO EL NUEVO TOKEN
        await mUsuario.refreshToken(token,userDB.idUsuario);
      
        
        //ENVIO DE EMAIL CON LINK PARA REALIZAR EL RESET PASSWORD
        let verificationLink = `${config.URL_SITE}/new-password/${token}`;
        const nodemailer = new Nodemailer();
        const mailOptions = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
            to:`${userDB.email}`,
            subject:'Recuperación de contraseña',
            html:`
                <p>Recibimos un pedido para restablecer la contraseña de tu usuario.</p>
                <br/>
                <p>Para iniciar el proceso de reinicio, hace click en el siguiente botón:</p>
                <a style="width: 100%;
                display: block;
                padding: 7px;
                text-align: center;
                border-radius: 20px;
                box-shadow: 0px 2px 1px -1px rgba(228, 224, 224, 0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
                background-color: #FFB347;
                color: white!important;" href="${verificationLink}">Cambiar contraseña</a>
                <p>Este link solo puede ser usado una vez.</p>
                <p>Si tiene que reiniciar su contraseña otra vez, por favor visite <a href="${config.URL_SITE}">${config.URL_SITE}</a> para iniciar el proceso nuevamente.</p>

                <p>Si usted no realizo el pedido de reseteo, ignore este email.</p>

                <b>OLIVER PETSHOP</b>
            `
        };
        await nodemailer.send(mailOptions);
        res.status(200).json({
            ok:true,
            info:'Hemos enviado un email con los pasos para poder realizar el cambio de contraseña a la dirección con la cual usted se registro!'
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })   
    }
}

exports.newPassword = async(req,res)=>{
    const mUsuario = new UsuarioModel();
    const token = req.get('refresh-token');

    try {
        let user = await mUsuario.getBytoken(token);
        user = user[0];
        if(!user) return res.status(400).json({
            ok:false,
            info:'No se encontro el usuario'
        });
        
        const {newPassword,confirmNewPassword} = req.body;
        const email = user.email;

        if(newPassword!=confirmNewPassword) return res.status(400).json({
            ok:false,
            info:'Las contraseñas no coinciden'
        });

        // actualizo la contraseña
        await mUsuario.resetPassword(email,newPassword);

        //refresh token
        const newToken = jwt.sign({
            usuario:{
                idUsuario:user.idUsuario,
                email:user.email,
                admin:user.admin
            }
        },config.seed, { expiresIn: config.caducidad_token });
        await mUsuario.refreshToken(newToken,user.idUsuario);

        res.status(200).json({
            ok:true,
            info:'Se ha modificado la contraseña con éxito',
            token:newToken
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        }) 
    }
}