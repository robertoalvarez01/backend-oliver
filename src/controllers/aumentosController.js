const SubProductoModel = require('../models/SubProducto');
const ProductoModel = require('../models/Producto');

exports.auentarPorMarca = async (req,res)=>{
    try {
        const {body:{idMarca,aumento}} = req;
        const productoM = new ProductoModel();
        const productos = await productoM.getByIdMarca(idMarca);

        const subproductoM = new SubProductoModel();
        let prds = [];
        productos.map(prd=>(prds.push(prd.idProducto)));

        await subproductoM.aumentarPorIdProductos(aumento,prds);

        res.status(200).json({
            ok:true,
            message:`Se han modificado ${productos.length} productos`
        })
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}