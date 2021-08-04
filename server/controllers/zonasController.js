const ZonaModel = require("../models/Zona");

exports.create = async(req,res)=>{
    try {
        const zonaM = new ZonaModel();
        const {body} = req;
        if(!body.zona || !body.dia) return res.status(503).json({
            ok:false,
            error:'Datos recibidos no suficientes'
        });
        await zonaM.create(body);
        res.status(200).json({
            ok:true,
            info:'Zona creada'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.update = async(req,res)=>{
    try {
        const zonaM = new ZonaModel();
        const {body} = req;
        if(!body.zona || !body.dia) return res.status(503).json({
            ok:false,
            error:'Datos recibidos no suficientes'
        });
        await zonaM.update(body,req.params.id);
        res.status(200).json({
            ok:true,
            info:'Zona modificada'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.delete = async(req,res)=>{
    try {
        const zonaM = new ZonaModel();
        await zonaM.delete(req.params.id);
        res.status(200).json({
            ok:true,
            info:'Zona eliminada'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.getAll = async(req,res)=>{
    try {
        const zonaM = new ZonaModel();
        const data = await zonaM.getAll();
        res.status(200).json({
            ok:true,
            data,
            info:'Zonas listadas'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}

exports.getById = async(req,res)=>{
    try {
        const zonaM = new ZonaModel();
        const {id} = req.params;
        const data = await zonaM.getOne(id);
        res.status(200).json({
            ok:true,
            data,
            info:'Zona listada'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        });
    }
}