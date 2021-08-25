const OfertaModel = require("../models/Oferta");
const CloudStorage = require("../services/CloudStorage");
const ProductoOfertaModel = require("../models/ProductoOferta");

exports.gelAll = async (req, res) => {
  const oModel = new OfertaModel();
  try {
    const {
      query: { desde, cantidad },
    } = req;
    const ofertas = await oModel.getAll(desde, cantidad);
    res.status(200).json({
      ok: true,
      data: ofertas,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.getOne = async (req, res) => {
  const oModel = new OfertaModel();
  const prdOModel = new ProductoOfertaModel();
  try {
    const {
      params: { id },
    } = req;
    const oferta = await oModel.getById(id);
    const promisesProductosOferta = [];
    oferta.map((item) => {
      let promise = prdOModel.getByOferta(item.id).then((productos) => {
        item.productos = productos;
      });
      promisesProductosOferta.push(promise);
    });

    await Promise.all(promisesProductosOferta);
    res.status(200).json({
      ok: true,
      data: oferta,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.create = async (req, res) => {
  const oModel = new OfertaModel();
  const prdOModel = new ProductoOfertaModel();
  const cs = new CloudStorage("ofertas");
  try {
    const { body, file } = req;
    body.foto = await cs.upload(file);
    await oModel.create(body);

    //obtener el id de la ultima oferta registrada
    const lastId = await oModel.getAll(0, 1);

    //cargo los productos de la oferta
    let promisesAddProductoOferta = [];
    const productos = JSON.parse(body.productos);
    productos.map((producto) => {
      producto.idOferta = lastId[0].id;
      //console.log(producto);
      promisesAddProductoOferta.push(prdOModel.create(producto));
    });
    await Promise.all(promisesAddProductoOferta);

    res.status(201).json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

//modifica solo los datos de la oferta. NO los productos.
exports.update = async (req, res) => {
  const oModel = new OfertaModel();
  const cs = new CloudStorage("ofertas");
  try {
    const {
      body,
      file,
      params: { id },
    } = req;
    body.foto = file ? await cs.upload(file) : null;
    await oModel.update(body, id);
    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  const oModel = new OfertaModel();
  try {
    const {
      params: { id },
    } = req;
    await oModel.delete(id);
    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.agregarProducto = async (req, res) => {
  const prdOModel = new ProductoOfertaModel();
  try {
    const {
      body: { productos },
      params: { idOferta },
    } = req;
    let promises = [];
    productos.map((producto) => {
      producto.idOferta = idOferta;
      promises.push(prdOModel.create(producto));
    });
    await Promise.all(promises);
    res.status(201).json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

exports.quitarProducto = async (req, res) => {
  const prdOModel = new ProductoOfertaModel();
  try {
    const { id } = req.params;
    await prdOModel.deleteOne(id);
    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};
