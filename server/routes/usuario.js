const express = require('express');
const UsuarioService = require('../services/UsuarioService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const { verificarToken, verificarAdmin_role,verificarRefreshToken } = require('../middlewares/autenticacion')
const app = express();
const upload = require('../lib/multer');
const CloudStorage = require('../services/CloudStorage');
const Nodemailer = require('../services/Nodemailer');

app.get('/usuario', [verificarToken,verificarAdmin_role],async(req, res)=>{
    try{
        const usuario = new UsuarioService();
        const data = await usuario.getAll();
        res.status(200).json({
            data,
            info:'Usuarios Listados'
        })
    }catch(err){
        res.send(503).json({
            err
        })
    }
});

app.get('/usuario/:id',verificarToken,async(req,res)=>{
    try {
        const usuario = new UsuarioService();
        const data = await usuario.getOne(req.params.id);
        res.status(200).json({
            data,
            info:'Usuario listado'
        })
    } catch (err) {
        res.status(503).json({
            error:err
        })
    }
})

app.post('/register',async(req, res)=>{
    try {
        const usuario = new UsuarioService();
        const {body} = req;
        const register = await usuario.create(body,null);
        if(register.protocol41){
            let dataUser = {
                email:body.email,
                password:body.password
            };
            const users = await usuario.login(dataUser);
            if(users.length==0){
                return res.status(401).json({
                    info:'Usuario o contraseña incorrectos'
                })
            };
            const userDB = users[0];
            bcrypt.compare(dataUser.password, userDB.password, async(err, response)=>{
                if(response){
                    let token = jwt.sign({
                        usuario: userDB
                    }, config.seed, { expiresIn: config.caducidad_token });
                    let tokenEmail = jwt.sign({
                        usuario:userDB
                    },userDB.email,{expiresIn:'1d'});

                    await usuario.refreshToken(token,userDB.idUsuario);

                    let verificationLink = `${config.URL_API}/auth/confirmed?token=${tokenEmail}&email=${userDB.email}`;
                    //ENVIO DE EMAIL CON LINK PARA REALIZAR CONFIRMACION DE CUENTA
                    const nodemailer = new Nodemailer();
                    const mailOptions = {
                        from:`${config.ACCOUNT_USERNAME}`,
                        to:`${userDB.email}`,
                        subject:'Confirmación de cuenta',
                        html:`
                            <h1>Bienvenido ${userDB.nombre} a Petshop Oliver</h1>
                            <br/>
                            <p>Te pedimos por favor, que confirmes tu cuenta presionando el botón que se encuentra abajo para poder finalizar el registro. ¡Muchas gracias!</p>
                            <a style="width: 100%;
                            display: block;
                            padding: 7px;
                            text-align: center;
                            border-radius: 20px;
                            box-shadow: 0px 2px 1px -1px rgba(228, 224, 224, 0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
                            background-color: #FFB347;
                            color: white!important;" href="${verificationLink}">Confirmar cuenta</a>

                            <b>OLIVER PETSHOP</b>
                        `
                    };
                    nodemailer.send(mailOptions).then(result=>{
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
                    }).catch(err=>{
                        res.status(500).json({ok:false,error:err})
                    })
                }else{
                    return res.status(401).json({
                        info:'Usuario o contraseña incorrectos'
                    })
                }
            });
        }else if(register.errno == 1062){
            return res.status(500).json({
                ok:false,
                info:'Ya existe un usuario con ese email'
            })
        }else{
            return res.status(500).json({
                ok:false,
                info:'Problemas al crear el usuario'
            })
        }
    } catch (error) {
        res.status(500).send({
            ok:false,
            error:'Error en el servidor'
        })        
    }
});


app.post('/usuario',async(req, res)=>{
    try {
        const usuario = new UsuarioService();
        const {body} = req;
        const response = await usuario.create(body,null);
        if(response.errno == 1062){
            return res.status(200).json({
                ok:false,
                info:'Ya existe un usuario con ese email'
            })
        }else if(response.protocol41){
            res.status(200).json({
                response
            })
        }
    } catch (error) {
        res.status(500).json({error})        
    }
});


app.put('/usuario/:id', [verificarToken, verificarAdmin_role], async(req, res)=>{
    try {
        const {id} = req.params;
        const {body} = req
        const usuario = new UsuarioService();
        const response = await usuario.update(body,id);
        res.json({
            data:response,
            info:'Operacion terminada'
        });
    } catch (error) {
        res.status(500).json({error})  
    }
});

app.put('/actualizarUsuarioDesdeWeb/:id',[verificarToken,/*upload.single('foto')*/],async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req;
        const usuario = new UsuarioService();
        const response = await usuario.updateFromWeb(body,id);
        const updatedUser = await usuario.getOne(id);
        let token = jwt.sign({
            usuario: updatedUser[0]
        }, config.seed, { expiresIn: config.caducidad_token });
        await usuario.refreshToken(token,updatedUser[0].idUsuario);
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
        res.status(503).json({
            error
        })        
    }
})

app.put('/actualizarFotoUsuarioDesdeWeb/:id',[verificarToken,upload.single('foto')],async(req,res)=>{
    try {
        const {id} = req.params;
        const usuario = new UsuarioService();
        if(!req.file) return res.status(503).json({ok:false,error:'No se recibido ninguna imagen'});
        const {file:foto} = req;
        const cs = new CloudStorage('usuarios');
        return cs.upload(foto).then(async url=>{
            const response = await usuario.updateFotoFromWeb(url,id);
            const updatedUser = await usuario.getOne(id);
            let token = jwt.sign({
                usuario: updatedUser[0]
            }, config.seed, { expiresIn: config.caducidad_token });
            await usuario.refreshToken(token,updatedUser[0].idUsuario);
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
                info:response,
                user:userDB
            })
        }).catch(err=>{
            res.status(500).json({error:err.message})
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})

app.put('/actualizarDireccion/:id',verificarToken,async(req,res)=>{
    try {
        const {address,lat,lon} = req.body;
        const {id:idUsuario} = req.params;
        if(address=='' || lat == '' || lon == '' || !idUsuario) return res.status(400).json({
            ok:false,
            info:'Datos recibidos no suficientes'
        });
        const uService = new UsuarioService();
        await uService.updateAddress({address,lat,lon},idUsuario);
        const updatedUser = await uService.getOne(idUsuario);
        let token = jwt.sign({
            usuario: updatedUser[0]
        }, config.seed, { expiresIn: config.caducidad_token });
        await uService.refreshToken(token,updatedUser[0].idUsuario);
        return res.status(200).json({
            ok:true,
            usuario:{
                email:updatedUser[0].email,
                nombre:updatedUser[0].nombre,
                telefono:updatedUser[0].telefono,
                foto:updatedUser[0].foto,
                address:updatedUser[0].address,
                idUsuario:updatedUser[0].idUsuario,
                token,
                lat:updatedUser[0].lat,
                lon:updatedUser[0].lon
            }
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            info:error.message
        })
    }
})

app.delete('/usuario/:id', [verificarToken, verificarAdmin_role], async(req, res)=>{
    try {
        const {id} = req.params;
        const usuario = new UsuarioService();
        const response = await usuario.delete(id);
        res.status(200).json({
            data:response,
            info:'Operación terminada'
        })
    } catch (error) {
        res.status(500).json({error}) 
    }
});

app.post('/resetPassword',async(req,res)=>{
    try {
        const {idUsuario,email} = req.body;
        if(!idUsuario && !email) return res.status(500).json({
            ok:false,
            info:'Datos recibidos insuficientes'
        });
        const uService = new UsuarioService();

        //OBTENGO EL USUARIO DE LA DB
        let user;
        if(idUsuario){
            user = await uService.getOne(idUsuario);
        }else if(email){
            user = await uService.getByEmail(email);
        }

        if(user.length==0 || user.length>1) return res.status(403).json({
            ok:false,
            info:'Operacion no permitida'
        });
        const userDB = user[0];

        //GENERO NUEVO TOKEN PARA GUARDARLO EN DB
        let token = jwt.sign({
            usuario:userDB
        },config.seed, { expiresIn: '10m' });

        //GUARDO EL NUEVO TOKEN
        try {
            await uService.refreshToken(token,userDB.idUsuario);
        } catch (error) {
            return res.status(400).json({
                ok:false,
                info:'Problemas en el servidor'
            })
        }

        let verificationLink = `${config.URL_SITE}/new-password/${token}`;

        //ENVIO DE EMAIL CON LINK PARA REALIZAR EL RESET PASSWORD
        const nodemailer = new Nodemailer();
        const mailOptions = {
            from:`${config.ACCOUNT_USERNAME}`,
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
        nodemailer.send(mailOptions).then(result=>{
            res.status(200).json({
                ok:true,
                info:'Hemos enviado un email con los pasos para poder realizar el cambio de contraseña a la dirección con la cual usted se registro!'
            })
        }).catch(err=>{
            res.status(500).json({ok:false,error:err})
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
})

app.put('/new-password',verificarRefreshToken,async(req,res)=>{
    const uService = new UsuarioService();
    const token = req.get('refresh-token');

    try {
        let user = await uService.getBytoken(token);
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
        await uService.resetPassword(email,newPassword);

        //refresh token
        const newToken = jwt.sign({
            usuario:user
        },config.seed, { expiresIn: config.caducidad_token });
        await uService.refreshToken(newToken,user.idUsuario);

        res.status(200).json({
            ok:true,
            info:'Se ha modificado la contraseña con éxito',
            token:newToken
        });

    } catch (error) {
        res.status(400).json({
            ok:false,
            info:error.message
        })
    }
});

app.get('/verify-sesion',verificarToken,async(req,res)=>{
    const uService = new UsuarioService();
    const token = req.get('token');
    try {
        let user = await uService.getBytoken(token);
        if(user.length>0 && user.length==1){
            return res.status(200).json({
                ok:true,
                info:'Sesión activa'
            });
        }
        res.status(401).json({
            ok:false,
            info:'Sesión expirada'
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            info:error.message
        })
    }
});

app.get('/auth/confirmed',async(req,res,next)=>{
    const {token,email} = req.query;
    try {
        const {usuario:{idUsuario}} = jwt.verify(token,email);
        const Uservice = new UsuarioService();
        await Uservice.confirmAccount(idUsuario);
    } catch(err) {
        console.log(err);
        res.status(403).json({
            ok:false,
            info:'No autorizado'
        })
    }
    return res.redirect(config.URL_SITE);
})


module.exports = app;
