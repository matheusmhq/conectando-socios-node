const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const { name, email, password } = req.body;
    var passwordHash = await bcrypt.hash(password, 10);

    try {
      const conn = await connect();

      //Verify if email has register
      const [row] = await conn.query("SELECT * FROM user WHERE email=?", [
        email,
      ]);
      if (row.length > 0) {
        return res.status(400).json({
          type: "error",
          msg: "Esse e-mail já está cadastrado no sistema",
        });
      }

      const sql = "INSERT INTO user(name,email,password) VALUES (?,?,?)";
      const values = [name, email, passwordHash];
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

      //Verify if exist account with this id
      const [row] = await conn.query("SELECT * FROM user WHERE id=?", [id]);
      if (row.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Usuário não encontrado",
        });
      }

      const sql = "UPDATE user SET name=?, email=? WHERE id=?";
      const values = [name, email, id];
      await conn.query(sql, values);

      return res.status(200).json({
        type: "success",
        msg: "Usuário atualizado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist account with this id
      const [row] = await conn.query("SELECT * FROM user WHERE id=?", [id]);
      if (row.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Usuário não encontrado",
        });
      }

      return res.status(200).json({
        type: "success",
        user: row[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
