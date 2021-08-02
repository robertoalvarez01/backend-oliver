const CloudStorage = require("../services/CloudStorage");
const BannerModel = require('../models/Banner');

exports.agregarBanner = async(req,res)=>{
    try {
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        if(!req.file){
            return res.status(503).json({error:'Imagen no recibida'});
        }
        const {file:foto} = req;
        const cs = new CloudStorage('banners');
        const bannerModel = new BannerModel();
        const url = await cs.upload(foto);
        await bannerModel.create(body,url);
        res.status(200).json({
            ok:true
        });
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
};

exports.modificarBanner = async(req,res)=>{
    try {
        const {id} = req.params;
        const {body} = req;
        if(Object.keys(body).length===0) return res.status(503).json({error:'Ningun dato recibido'});
        const bannerModel = new BannerModel();
        let url = null;
        if(req.file){
            const cs = new CloudStorage('banners');
            url = await cs.upload(req.file);
        }
        await bannerModel.update(body,id,url);
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

exports.eliminarBanner = async(req,res)=>{
    try {
        const {id} = req.params;
        const bannerModel = new BannerModel();
        await bannerModel.delete(id);
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
        let isAdmin = req.query.admin || false;
        const bannerModel = new BannerModel();
        const response = await bannerModel.getAll(isAdmin);
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
        const bannerModel = new BannerModel();
        const response = await bannerModel.get(id);
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