const { config } = require("../config/config");
const Model = require("./Model");

class ProductoOfertaModel extends Model {
  constructor() {
    super(config.TABLE_PRODUCTOSOFERTAS);
  }

  async getAll() {
    try {
      const data = await this.getAllResources();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getByOferta(id) {
    this.schema = "vw_productosOfertas"; //reseteo el nombre del esquema asi hace el select del vw y no de la tabla
    this.query = "SELECT * FROM " + this.schema + " WHERE idOferta = " + id;
    try {
      const productos = await this.execute();
      return productos;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(data){
    this.query = "CALL " + config.SP_PRODUCTOSOFERTA + `(${data.idProducto},${data.idSubProducto},${data.idOferta})`;
    try {
      const response = await this.execute();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteOne(id){
    this.query = "DELETE FROM " + this.schema + " WHERE id = " + id;
    try {
      const response = await this.execute();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = ProductoOfertaModel;
