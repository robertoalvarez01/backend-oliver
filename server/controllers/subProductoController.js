const SubProductoModel = require('../models/SubProducto');
const CloudStorage = require('../services/CloudStorage');

exports.create = async(req,res)=>{
    try {
        if(!req.file) return res.status(500).json({error:'Ninguna imagen insertada'});
        const {body,file:foto} = req;
        const cs = new CloudStorage();
        const subproducto = new SubProductoModel();
        const url = await cs.upload(foto);
        await subproducto.create(body,url);
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
        const {body,params:{id}} = req;
        const subproducto = new SubProductoModel();
        if(!req.file){
            await subproducto.update(body,id,null);
            return res.status(200).json({
                ok:true
            });
        }
        const {file:foto} = req;
        const cs = new CloudStorage();
        const url = await cs.upload(foto);
        await subproducto.update(body,id,url);
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

exports.delete = async(req,res)=>{
    try {
        const {id} = req.params;
        const subproducto = new SubProductoModel();
        await subproducto.delete(id);
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
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoModel();
        const response = await subproducto.getAll(desde,limite,isAdmin);
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

exports.getById = async(req,res)=>{
    try {
        const {id} = req.params;
        const subproducto = new SubProductoModel();
        const response = await subproducto.get(id);
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

exports.buscar = async(req,res)=>{
    try {
        let {busqueda} = req.query;
        busqueda = busqueda.toLowerCase();
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoModel();
        const response = await subproducto.search(busqueda,isAdmin);
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

exports.getOfertas = async(req,res)=>{
    try {
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        let isAdmin = req.query.admin || false;
        const subproducto = new SubProductoModel();
        const response = await subproducto.getOfertas(desde,limite,isAdmin);
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