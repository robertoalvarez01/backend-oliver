const express = require('express');
const UsuarioService = require('../services/UsuarioService');
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion')
const app = express();

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

app.post('/usuario',async(req, res)=>{
    try {
        const usuario = new UsuarioService();
        const {body} = req;
        const response = await usuario.create(body,null);
        res.status(200).json({
            data:response
        })
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