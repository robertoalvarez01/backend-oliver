const { config } = require("../config/config");
const Model = require("./Model");

class OfertaModel extends Model {
  constructor() {
    super(config.TABLE_OFERTAS);
  }

  async getAll(desde, cantidad) {
    this.query = `SELECT id,descripcion,precioFinal,validoHasta,activo,foto FROM ${this.schema} ORDER BY id DESC LIMIT ${desde},${cantidad}`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    this.query = `SELECT id,descripcion,precioFinal,validoHasta,activo,foto FROM ${this.schema} WHERE id = ${id} LIMIT 1`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(data) {
    this.query = `CALL ${config.SP_OFERTAS}(0,'${data.descripcion}','${data.precioFinal}','${data.validoHasta}',${data.activo},'${data.foto}')`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(data, id) {
    this.query = `CALL ${config.SP_OFERTAS}(${id},'${data.descripcion}','${data.precioFinal}','${data.validoHasta}',${data.activo},'${data.foto}')`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async delete(id) {
    this.query = `CALL ${config.SP_OFERTAS_DEL}(${id})`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = OfertaModel;
