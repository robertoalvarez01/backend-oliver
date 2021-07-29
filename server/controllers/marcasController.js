const CloudStorage = require('../services/CloudStorage');
const MarcasModel = require('../models/Marca');

exports.getAll = async (req,res)=>{
    try {
        const mMarcas = new MarcasModel();
        const response = await mMarcas.getAll();
        res.status(200).json({
            ok:true,
            data:response
        })
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
        const mMarcas = new MarcasModel();
        const response = await mMarcas.get(id);
        res.status(200).json({
            ok:true,
            data:response
        })
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
        if(!req.file) return res.status(500).json({error:'No se recibio la imagen de la marca'});
        const {file:imagen} = req;
        const cs = new CloudStorage('marcas');
        const url = await cs.upload(imagen);
        const mMarca = new MarcasModel();
        const response = await mMarca.create(body,url);
        res.status(200).json({
            ok:true,
            data:response
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}

exports.update = async(req,res)=>{
    try {
        const {body} = req;
        const {id} = req.params;
        const mMarca = new MarcasModel();
        if(!req.file){
            await mMarca.update(body,id,null);
            return res.status(200).json({
                ok:true
            })
        }

        const {file:imagen} = req;
        const cs = new CloudStorage('marcas');
        const url = await cs.upload(imagen);
        await mMarca.update(body,id,url);
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
        const mMarca = new MarcasModel();
        await mMarca.delete(id);
        res.status(200).json({
            ok:true
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}


