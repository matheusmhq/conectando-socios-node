const { connect } = require("../db");

module.exports = {
  async store(req, res) {
    const { idUser, idType, title, description } = req.body;

    try {
      const conn = await connect();

      //Verify if exist account with this id
      const [verifyId] = await conn.query("SELECT * FROM user WHERE id=?", [
        idUser,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Usuário não encontrado",
        });
      }

      const sql =
        "INSERT INTO project(idUser, idType, title, description, createdAt, updatedAt) VALUES (?,?,?,?,?,?)";
      const values = [
        idUser,
        idType,
        title,
        description,
        new Date(),
        new Date(),
      ];
      await conn.query(sql, values);

      return res.status(200).json({
        type: "success",
        msg: "Projeto cadastrado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { idType, title, description } = req.body;

    try {
      const conn = await connect();

      //Verify if exist project with this id
      const [verifyId] = await conn.query("SELECT * FROM project WHERE id=?", [
        id,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Projeto não encontrado",
        });
      }

      const sql =
        "UPDATE project SET idType=?, title=?, description=?, updatedAt=? WHERE id=?";
      const values = [idType, title, description, new Date(), id];
      await conn.query(sql, values);

      return res.status(200).json({
        type: "success",
        msg: "Projeto atualizado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist project with this id
      const [verifyId] = await conn.query("SELECT * FROM project WHERE id=?", [
        id,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Projeto não encontrado",
        });
      }

      return res.status(200).json({
        type: "success",
        project: verifyId[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist project with this id
      const [verifyId] = await conn.query("SELECT * FROM project WHERE id=?", [
        id,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Projeto não encontrado",
        });
      }

      await conn.query("DELETE FROM project WHERE id=?", [id]);

      return res.status(200).json({
        type: "success",
        msg: "Projeto deletado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
