const ProductoModel = require('../models/Producto');
const SubProductoModel = require('../models/SubProducto');
const {config} = require('../config/config');

exports.create = async(req,res)=>{
    try {
        const {body} = req;
        const productoModel = new ProductoModel();
        await productoModel.create(body);
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
        const productoModel = new ProductoModel();
        await productoModel.update(body,id);
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
        const productoModel = new ProductoModel();
        await productoModel.delete(id);
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
        const productoModel = new ProductoModel();
        const subproductoModel = new SubProductoModel();

        //productos
        const productos = await productoModel.getAll(desde,limite,isAdmin);

        //guardo cada promesa para obtener la foto,peso y precio de un subproducto de cada producto.
        let promesas = [];

        productos.map( res => {
            //llamo al metodo que me trae los subproductos a partir de un producto determinado
            const datasubprd = subproductoModel.getByIdProducto(res.idProducto,false,isAdmin).then(result=>{
                if(result.length>0){
                    res.foto = result[0].foto;
                    res.peso = result[0].peso;
                    res.precioUnidad = result[0].precioUnidad;
                    res.precioFinal = result[0].precioFinal;
                }else{
                    res.foto = config.DEFAULT_FOTO;
                    res.peso = null;
                    res.precioFinal = 0;
                };
            });
            promesas.push(datasubprd);
        });
        await Promise.all(promesas);
        res.status(200).json({
            ok:true,
            data:productos
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
        let isAdmin = req.query.admin || false;
        const {id} = req.params;
        const productoModel = new ProductoModel();
        const subproductoModel = new SubProductoModel();
        const producto = await productoModel.get(id);
        const subproductos = await subproductoModel.getByIdProducto(producto[0].idProducto,false,isAdmin);
        res.status(200).json({
            ok:true,
            data:producto,
            subproductos
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
        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);
        const productoModel = new ProductoModel();
        const subproductoModel = new SubProductoModel();

        const productos = await productoModel.search(desde,limite,busqueda,isAdmin);

        let promesas = [];
        productos.map(res=>{
            const datasubprd = subproductoModel.getByIdProducto(res.idProducto,true,isAdmin).then(result=>{
                if(result.length>0){
                    res.foto = result[0].foto;
                    res.peso = result[0].peso;
                    res.precioUnidad = result[0].precioUnidad;
                    res.precioFinal = result[0].precioFinal;
                }else{
                    res.foto = config.DEFAULT_FOTO;
                    res.peso = null;
                    res.precioFinal = 0;
                };
            });
            promesas.push(datasubprd);
        });
        await Promise.all(promesas);
        res.status(200).json({
            ok:true,
            data:productos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            error:error.message,
            info:'ashe'

        })
    } 
}

exports.filtrar = async (req,res)=>{
    try {
        let idCategoria = req.query.categoria || null;
        let idSubcategoria = req.query.subcategoria || null;
        let idMarca = req.query.marca || null;
        let desde = req.query.desde || 0;
        let limite = req.query.limite || 50;
        const productoModel = new ProductoModel();
        const subproductoModel = new SubProductoModel();
        if(!idCategoria && !idSubcategoria && !idMarca){
            return res.status(400).json({
                ok:false,
                info:'Ningun dato recibido'
            })
        };

        let promesas = [];
        const productos = await productoModel.filtrar(idCategoria,idSubcategoria,idMarca,desde,limite);
        productos.map(res=>{
            const datasubprd = subproductoModel.getByIdProducto(res.idProducto,true,false).then(result=>{
                if(result.length>0){
                    res.foto = result[0].foto;
                    res.peso = result[0].peso;
                    res.precioUnidad = result[0].precioUnidad;
                    res.precioFinal = result[0].precioFinal;
                }else{
                    res.foto = config.DEFAULT_FOTO;
                    res.peso = null;
                    res.precioFinal = 0;
                };
            });
            promesas.push(datasubprd);
        });
        await Promise.all(promesas);
        res.status(200).json({
            ok:true,
            data:productos,
            info:'Productos filtrados'
        });
    } catch (error) {
        res.status(500).json({
            ok:false,
            error:error.message
        })
    }
}