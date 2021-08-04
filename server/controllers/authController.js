const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const UsuarioModel = require('../models/Usuario');
const GoogleService = require('../services/GoogleService');

exports.login = async(req,res)=>{
    try {
        const {body} = req;
        const mUsuario = new UsuarioModel();
        const users = await mUsuario.login(body);

        //si no encuentra coincidencias con el email...
        if(users.length==0){
            return res.status(401).json({
                info:'Usuario o contraseña incorrectos'
            })
        };

        const userDB = users[0];

        //comparo el password recibido en el body con el hash que esta en db, si no concide envio un 401.
        const passwordIsValid = bcrypt.compare(body.password,userDB.password);
        if(!passwordIsValid){
            return res.status(401).json({
                info:'Usuario o contraseña incorrectos'
            })
        };

        let token = jwt.sign({
            usuario:{
                idUsuario:userDB.idUsuario,
                email:userDB.email,
                admin:userDB.admin
            }
        }, config.seed, { expiresIn: config.caducidad_token });

        //actualizo el token y lo guardo en la base de datos.
        await mUsuario.refreshToken(token,userDB.idUsuario);

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
        });
    }catch(error){
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.register = async(req,res)=>{
    try {
        const mUsuario = new UsuarioModel();
        const {body} = req;

        //Guardar usuario en base
        await mUsuario.register(body,null);

        //obtener los datos del usuario guardado desde base
        const users = await mUsuario.getByEmail(req.body.email);
        if(users.length==0){
            return res.status(401).json({
                ok:false
            });
        };
        const userDB = users[0];
        
        //creacion de token de session y de token para confirmar cuenta
        let token = jwt.sign({
            usuario: userDB.email
        }, config.seed, { expiresIn: config.caducidad_token });
        let tokenEmail = jwt.sign({
            usuario:{
                idUsuario:userDB.idUsuario,
                email:userDB.email,
                admin:userDB.admin
            }
        },userDB.email,{expiresIn:'1d'});

        //guardar token en base
        await usuario.refreshToken(token,userDB.idUsuario);

        
        //ENVIO DE EMAIL CON LINK PARA REALIZAR CONFIRMACION DE CUENTA
        let verificationLink = `${config.URL_API}/auth/confirmed?token=${tokenEmail}&email=${userDB.email}`;
        const nodemailer = new Nodemailer();
        const mailOptions = {
            from:`Oliver PETSHOP <petshop-oliver@hotmail.com>`,
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
        await nodemailer.send(mailOptions);

        //responder con los datos del usuario y su token de session.
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
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}



exports.verifySession = async(req,res)=>{
    const mUsuario = new UsuarioModel();
    const token = req.get('token');
    try {
        let user = await mUsuario.getByToken(token);
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
            error:error.message
        })  
    }
}

exports.confirmAccount = async(req,res)=>{
    const {token,email} = req.query;
    try {
        const {usuario:{idUsuario}} = jwt.verify(token,email);
        const mUsuario = new UsuarioModel();
        await mUsuario.confirmAccount(idUsuario);
        res.redirect(config.URL_SITE);
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })     
    }
}

exports.authenticationByGoogle = async(req,res)=>{
    try{
        const {token,googleId} = req.body;
        const gService = new GoogleService();
        const uModel = new UsuarioModel();

        const data = await gService.verify(token);
        const dataUser = {
            email:data.email,
            nombre:data.name,
            foto:data.picture
        };
        const usersInDb = await uModel.login(dataUser);

        //si ya hay un usuario registrado con ese email, entonces lo logueo.
        if(usersInDb.length>0){
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
        }
        
        //si no existe, tengo que registrar el usuario en la db y loguearlo.
        await uModel.registerWithGoogle(dataUser);
        const userDB = await uModel.login(dataUser);
        let token = jwt.sign({
            usuario:{
                idUsuario:userDB[0].idUsuario,
                email:userDB[0].email,
                admin:userDB[0].admin
            }
        }, config.seed, { expiresIn: config.caducidad_token });
        await uModel.refreshToken(token,userDB[0].idUsuario);
        res.status(200).json({
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
    }catch(err){
        res.status(500).json({ok:false,error:err.message});
    }
}