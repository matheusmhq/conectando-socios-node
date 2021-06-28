const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    try {
      const conn = await connect();

      const [listState] = await conn.query("SELECT * FROM state");
      conn.end();

      return res.status(200).json({
        type: "success",
        data: listState,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
