const CloudStorage = require('../services/CloudStorage');
const CategoriaModel = require('../models/Categoria');

exports.create = async(req,res)=>{
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(!req.file){
            return res.status(503).json({error:'Imagen no recibida'});
        }
        const {file:foto} = req;
        const cs = new CloudStorage('categorias');
        const cModel = new CategoriaModel();
        const url = await cs.upload(foto);
        const response = await cModel.create(body,url);
        res.status(200).json({
            ok:true,
            info:response
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
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(req.file){
            const cModel = new CategoriaModel();
            const cs = new CloudStorage('categorias');
            const url = await cs.upload(req.file);
            const response = await cModel.update(body,id,url);
            return res.status(200).json({
                ok:true,
                info:response
            });
        }
        const cModel = new CategoriaModel();
        const response = await cModel.update(body,id,null);
        res.status(200).json({
            ok:true,
            info:response
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
        const cModel = new CategoriaModel();
        const response = await cModel.delete(id);
        res.status(200).json({
            ok:true,
            info:response
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
        const cModel = new CategoriaModel();
        const response = await cModel.getAll();
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
        const cModel = new CategoriaModel();
        const response = await cModel.getOne(id);
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