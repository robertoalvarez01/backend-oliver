const express = require('express');
const GoogleService = require('../services/GoogleService.js');
const app = express();
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/Usuario');
const {config} = require('../config/config');
app.post('/google/tokensignin',async(req, res,next)=>{
    try{
        const {token,googleId} = req.body;
        const gService = new GoogleService();
        gService.verify(token).then(async data=>{
            const uModel = new UsuarioModel();
            const dataUser = {
                email:data.email,
                nombre:data.name,
                foto:data.picture
            };
            const usersInDb = await uModel.login(dataUser);
            if(usersInDb.length>0){
                //ya hay un usuario registrado con ese email, entonces lo logueo.
                const userDB = usersInDb[0];
                let token = jwt.sign({
                    usuario:{
                        idUsuario:userDB.idUsuario,
                        email:userDB.email,
                        admin:userDB.admin
                    }
                }, config.seed, { expiresIn: config.caducidad_token });
                await uModel.refreshToken(token,userDB.idUsuario);
                return res.status(200).json({
                    ok: true,
                    usuario:{
                        email:userDB.email,
                        nombre:userDB.nombre,
                        telefono:userDB.telefono,
                        foto:userDB.foto,
                        provider:userDB.provider,
                        address:userDB.address,
                        idUsuario:userDB.idUsuario,
                        lat:userDB.lat,
                        lon:userDB.lon
                    },
                    token
                });
            }else{
                //si no existe, tengo que registrar el usuario en la db y loguearlo.
                const register = await uModel.registerWithGoogle(dataUser);
                if(register){
                    const userDB = await uModel.login(dataUser);
                    let token = jwt.sign({
                        usuario:{
                            idUsuario:userDB[0].idUsuario,
                            email:userDB[0].email,
                            admin:userDB[0].admin
                        }
                    }, config.seed, { expiresIn: config.caducidad_token });
                    await uModel.refreshToken(token,userDB[0].idUsuario);
                    return res.status(200).json({
                        ok: true,
                        usuario:{
                            email:userDB[0].email,
                            nombre:userDB[0].nombre,
                            telefono:userDB[0].telefono,
                            foto:userDB[0].foto,
                            provider:userDB[0].provider,
                            address:userDB[0].address,
                            idUsuario:userDB.idUsuario,
                            lat:userDB.lat,
                            lon:userDB.lon
                        },
                        token
                    });
                }
            }
        }).catch(err=>{
            res.status(500).json({ok:false,error:err.message});
        });
    }catch(err){
        res.status(500).json({ok:false,error:err.message});
    }
});

module.exports = app;
