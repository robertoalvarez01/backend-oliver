const express = require('express');
const UsuarioService = require('../services/UsuarioService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('../config/config');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion')
const app = express();
const upload = require('../lib/multer');
const CloudStorage = require('../services/CloudStorage');

app.get('/usuario', verificarToken,async(req, res)=>{
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
            bcrypt.compare(dataUser.password, userDB.password, (err, response)=>{
                if(response){
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
                            ubicacion:userDB.address,
			idUsuario:userDB.idUsuario
                        },
                        token
                    })
                }
                return res.status(401).json({
                    info:'Usuario o contraseña incorrectos'
                })
            });
        }else if(register.errno == 1062){
            return res.status(200).json({
                ok:false,
                info:'Ya existe un usuario con ese email'
            })
        }else{
            return res.status(200).json({
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
        res.status(200).json({
            ok:true,
            info:response
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
            return res.status(200).json({
                ok:true,
                info:response
            })
        }).catch(err=>{
            res.status(500).json({error:err.message})
        })
    } catch (error) {
        
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

module.exports = app;
