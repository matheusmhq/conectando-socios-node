const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { idState } = req.query;

    var filters = [];
    var sql = "SELECT * FROM city";
    if (idState != 0 && idState != undefined) {
      filters.push(idState);
      sql += " WHERE city.uf=?";
    }

    try {
      const conn = await connect();

      const [listCity] = await conn.query(sql, filters);
      conn.end();

      return res.status(200).json({
        type: "success",
        data: listCity,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
