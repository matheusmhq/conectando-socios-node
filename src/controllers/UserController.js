const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;

    try {
      const conn = await connect();
      const sql = "INSERT INTO user(name,email,password) VALUES (?,?,?)";
      const values = [name, email, password];
      await conn.query(sql, values);

      return res.status(200).json({
        type: "success",
        msg: "Usuário cadastrado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
      const conn = await connect();
      const sql = "UPDATE user SET name=?, email=? WHERE id=?";
      const values = [name, email, id];
      await conn.query(sql, values);
      //const user = conn.query("SELECT * FROM user WHERE id=?", [id]);

      return res.status(200).json({
        type: "success",
        msg: "Usuário atualizado com sucesso",
        //user,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;
    console.log("ID SHOW " + id);

    try {
      const conn = await connect();
      const user = conn.query("SELECT * FROM user WHERE id=?", [id]);
      console.log("USER");
      console.log(user);

      return res.status(200).json({
        type: "success",
        user,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
