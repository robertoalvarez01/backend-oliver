const TamañoModel = require('../models/Tamaño');

exports.getAll = async (req,res)=>{
    try {
        const mTamaño = new TamañoModel();
        const info = await mTamaño.getAll();
        res.status(200).json({
            ok:true,
            data:info
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.getById = async (req,res)=>{
    try {
        const {id} = req.params;
        const mTamaño = new TamañoModel();
        const response = await mTamaño.get(id);
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

exports.create = async(req,res) =>{
    try {
        const {body} = req;
        const mTamaño = new TamañoModel();
        await mTamaño.create(body);
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
        const mTamaño = new TamañoModel();
        await mTamaño.update(body,id);
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
        const mTamaño = new TamañoModel();
        await mTamaño.delete(id);
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


