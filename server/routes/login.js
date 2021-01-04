const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const UsuarioService = require('../services/UsuarioService');
const app = express();

app.post('/login', async(req, res) => {
    try {
        const {body} = req;
        const usuarioS = new UsuarioService();
        const users = await usuarioS.login(body);
        //si no encuentra coincidencias con el email...
        if(users.length==0){
            return res.status(401).json({
                info:'Usuario o contraseña incorrectos'
            })
        };
        const userDB = users[0];
        //comparo el password recibido en el body con el hash que esta en db, si no concide envio un 401.
        bcrypt.compare(body.password, userDB.password, async (err, response)=>{
            if(response){
                let token = jwt.sign({
                    usuario: userDB
                }, config.seed, { expiresIn: config.caducidad_token });
                //actualizo el token y lo guardo en la base de datos.
                const refreshtoken = await usuarioS.refreshToken(token,userDB.idUsuario);
                return res.status(200).json({
                    ok: true,
                    usuario:{
                        email:userDB.email,
                        nombre:userDB.nombre,
                        telefono:userDB.telefono,
                        foto:userDB.foto,
                        provider:userDB.provider,
                        ubicacion:userDB.address,
                        admin:userDB.admin,
                        idUsuario:userDB.idUsuario,
                        lat:userDB.lat,
                        lon:userDB.lon
                    },
                    token
                })
            }
            return res.status(401).json({
                info:'Usuario o contraseña incorrectos'
            })
        });
    } catch (error) {
        res.status(500).json({error})     
    }
});


module.exports = app;
