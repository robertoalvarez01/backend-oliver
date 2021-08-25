const MediosDePagoModel = require("../models/MediosDePago");

exports.create = async(req,res)=>{
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const medioModel = new MediosDePagoModel();
        await medioModel.create(body);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.update = async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req;
        const medioModel = new MediosDePagoModel();
        await medioModel.update(body,id);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.delete = async(req,res)=>{
    try {
        const {id} = req.params;
        const medioModel = new MediosDePagoModel();
        await medioModel.delete(id);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.getAll = async(req,res)=>{
    try {
        const medioModel = new MediosDePagoModel();
        const response = await medioModel.getAll();
        res.status(200).json({
            ok:true,
            data:response
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.getById = async(req,res)=>{
    try {
        const {id} = req.params;
        const medioModel = new MediosDePagoModel();
        const response = await medioModel.get(id);
        res.status(200).json({
            ok:true,
            data:response
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}