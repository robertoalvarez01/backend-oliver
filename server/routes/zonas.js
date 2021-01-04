const express = require('express');
const app = express();
const { verificarToken, verificarAdmin_role } = require('../middlewares/autenticacion');
const ZonaService = require('../services/ZonaServices');

app.get('/zonas',verificarToken, async(req,res,next)=>{
    try {
        const zonaService = new ZonaService();
        const data = await zonaService.getAll();
        if(data.length>=1){
            return res.status(200).json({
                ok:true,
                data,
                info:'Zonas listadas'
            })
        }
        return res.status(503).json({
            ok:false,
            info:data
        })
    } catch (error) {
        res.status(503).json({
            error:error.message
        })        
    }
})

app.get('/zonas/:id',verificarToken,async (req,res,next)=>{
    try {
        const zonaService = new ZonaService();
        const {id} = req.params;
        const data = await zonaService.getOne(id);
        if(data.length==1){
            return res.status(200).json({
                ok:true,
                data,
                info:'Zona listada'
            })
        }
        return res.status(503).json({
            ok:false,
            info:'Ningun recurso obtenido con ese id'
        })
    } catch (error) {
        res.status(503).json({
            error:error.message
        })        
    }
})

app.post('/zona',[verificarToken,verificarAdmin_role],async (req,res)=>{
    try {
        const zonaService = new ZonaService();
        const {body} = req;
        if(!body.zona || !body.dia) return res.status(503).json({
            ok:false,
            info:'Datos recibidos no suficientes'
        });
        const response = await zonaService.create(body);
        if(response.protocol41){
            return res.status(200).json({
                ok:true,
                data:response,
                info:'Zona creada'
            });
        }
        return res.status(503).json({
            ok:false,
            data:response
        })
    } catch (error) {
        res.status(503).json({
            error:error.message
        })
    }
});

app.put('/zona/:id',[verificarToken,verificarAdmin_role],async(req,res)=>{
    try {
        const zonaService = new ZonaService();
        const {body} = req;
        if(!body.zona || !body.dia) return res.status(503).json({
            ok:false,
            info:'Datos recibidos no suficientes'
        });
        const response = await zonaService.update(body,req.params.id);
        if(response.protocol41){
            return res.status(200).json({
                ok:true,
                data:response,
                info:'Zona modificada'
            });
        }
        return res.status(503).json({
            ok:false,
            data:response
        })
    } catch (error) {
        res.status(503).json({
            error:error.message
        })
    }
})

app.delete('/zona/:id',[verificarToken,verificarAdmin_role],async (req,res)=>{
    try {
        const zonaService = new ZonaService();
        if(!req.params.id) return res.status(503).json({
            ok:false,
            info:'Datos recibidos no suficientes'
        });
        const response = await zonaService.delete(req.params.id);
        if(response.protocol41){
            return res.status(200).json({
                ok:true,
                data:response,
                info:'Zona eliminada'
            });
        }
        return res.status(503).json({
            ok:false,
            data:response
        })
    } catch (error) {
        res.status(503).json({
            error:error.message
        })
    }
});

module.exports = app;