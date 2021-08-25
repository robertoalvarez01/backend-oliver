const LegalesModel = require("../models/Legales");

exports.create = async(req,res)=>{
    try {
        const {body} = req;
        const legalesM = new LegalesModel();
        await legalesM.create(body);
        res.status(200).json({
            ok:true,
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
};

exports.update = async(req,res)=>{
    try {
        const {body} = req;
        const legalesM = new LegalesModel();
        await legalesM.update(body);
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

exports.getInfo = async(req,res)=>{
    try {
        const legalesM = new LegalesModel();
        const response = await legalesM.get();
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
};