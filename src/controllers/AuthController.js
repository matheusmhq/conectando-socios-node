const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const conn = await connect();
      const [row] = await conn.query("SELECT * FROM user WHERE email=?", [
        email,
      ]);
      const user = row[0];

      bcrypt.compare(password, user.password, function (err, match) {
        if (match) {
          return res.json({ type: "success", user });
        } else {
          return res.status(400).json({
            type: "error",
            msg: "Dados incorretos",
          });
        }
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
