const { config } = require("../config/config");
const Model = require("./Model");

class OfertaModel extends Model {
  constructor() {
    super(config.TABLE_OFERTAS);
  }

  async getAll(desde, cantidad,admin) {
    this.query = `SELECT id,titulo,descripcion,validoHasta,activo,foto FROM ${this.schema} `;
    if(!admin){
      this.query += `WHERE activo = 1 `;
    }
    this.query += `ORDER BY id DESC LIMIT ${desde},${cantidad}`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    this.query = `SELECT id,titulo,descripcion,validoHasta,activo,foto FROM ${this.schema} WHERE id = ${id} LIMIT 1`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async create(data) {
    this.query = `CALL ${config.SP_OFERTAS}(0,'${data.titulo}','${data.descripcion}','${data.validoHasta}',${data.activo},'${data.foto}')`;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(data, id) {
    this.query = `CALL ${config.SP_OFERTAS}(${id},'${data.titulo}','${data.descripcion}','${data.validoHasta}',${data.activo},'${data.foto}')`;
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

  async cambiarEstado(id){
    this.query = `CALL ${config.SP_CAMBIAR_ESTADO_OFERTAS}(${id})`;
    try {
      const response = await this.execute();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = OfertaModel;
