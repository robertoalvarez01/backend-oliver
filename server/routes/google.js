const express = require('express');
const GoogleService = require('../services/GoogleService.js');
const app = express();
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/Usuario');
const {config} = require('../config/config');
app.post('/google/tokensignin',async(req, res)=>{
    try{
        const gService = new GoogleService();
        const {token} = req.body;
        const data = await gService.verify(token);
        if(Object.keys(data).length>0){
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
                    usuario: userDB
                }, config.seed, { expiresIn: config.caducidad_token });
                return res.status(200).json({
                    ok: true,
                    usuario:{
                        email:userDB.email,
                        nombre:userDB.nombre,
                        telefono:userDB.telefono,
                        foto:userDB.foto,
                        provider:userDB.provider,
                        ubicacion:userDB.ubicacion
                    },
                    token
                });
            }else{
                //si no existe, tengo que registrar el usuario en la db y loguearlo.
                const register = await uModel.registerWithGoogle(dataUser);
                if(register){
                    const userDB = await uModel.login(dataUser)[0];
                    let token = jwt.sign({
                        usuario: userDB
                    }, config.seed, { expiresIn: config.caducidad_token });
                    return res.status(200).json({
                        ok: true,
                        usuario:{
                            email:userDB.email,
                            nombre:userDB.nombre,
                            telefono:userDB.telefono,
                            foto:userDB.foto,
                            provider:userDB.provider,
                            ubicacion:userDB.ubicacion
                        },
                        token
                    });
                }
            }
        };
        return res.status(503).json({
            error:true,
            info:'Token no valido'
        });
    }catch(err){
        res.sendStatus(503).json({
            error:true,
            info:'Problemas al recibir el token'
        })
    }
});

module.exports = app;