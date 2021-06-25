const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const conn = await connect();

      //Verify if exist account with this email
      const [verifyId] = await conn.query("SELECT * FROM user WHERE email=?", [
        email,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Dados incorretos",
        });
      }

      const user = verifyId[0];
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
