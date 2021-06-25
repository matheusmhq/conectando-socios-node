const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    try {
      const conn = await connect();

      const [row] = await conn.query("SELECT * FROM state");
      return res.status(200).json({
        type: "success",
        data: row,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
