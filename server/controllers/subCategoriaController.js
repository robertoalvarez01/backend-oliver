const SubCategoriaModel = require('../models/SubCategoria');

exports.create = async(req,res)=>{
    try {
        const {body} = req;
        const subcategoria = new SubCategoriaModel();
        await subcategoria.create(body);
        res.status(200).json({
            ok:true
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
};

exports.update = async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req;
        const subcategoria = new SubCategoriaModel();
        await subcategoria.update(body,id);
        return res.status(200).json({
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
        const subcategoria = new SubCategoriaModel();
        await subcategoria.delete(id);
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
        const subcategoria = new SubCategoriaModel();
        const response = await subcategoria.getAll();
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
        const subcategoria = new SubCategoriaModel();
        const response = await subcategoria.get(id);
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