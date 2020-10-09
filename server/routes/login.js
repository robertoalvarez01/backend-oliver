const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
//const { OAuth2Client } = require('google-auth-library');
//const client = new OAuth2Client(process.env.CLIENT_ID);


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
        bcrypt.compare(body.password, userDB.password, (err, response)=>{
            if(response){
                let token = jwt.sign({
                    usuario: userDB
                }, config.seed, { expiresIn: config.caducidad_token });
                return res.status(200).json({
                    ok: true,
                    usuario: userDB,
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


// Configuraciones de Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });


    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar las credenciales ya creadas'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        } else {

            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })

            })

        }
    })

    // res.json({
    //     usuario: googleUser
    // })

});

module.exports = app;