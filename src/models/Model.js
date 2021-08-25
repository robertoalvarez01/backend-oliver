const connection = require("../lib/mysql");

class Model {
  constructor(schema) {
    this.schema = schema;
    this.query = null;
  }

  async execute() {
    return new Promise((resolve, reject) => {
      connection.query(this.query, (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(res);
      });
    });
  }

  async getAllResources(){
    this.query = "SELECT * FROM " + this.schema;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll(){
    this.query = "DELETE FROM " + this.schema;
    try {
      const data = await this.execute();
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

}

module.exports = Model;
