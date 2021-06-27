const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    try {
      const conn = await connect();

      const [list] = await conn.query("SELECT * FROM project_types");
      conn.end();

      return res.status(200).json({
        type: "success",
        data: list,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async store(req, res) {
    const { name } = req.body;

    try {
      const conn = await connect();

      const sql = "INSERT INTO project_types(name) VALUES (?)";
      const values = [name];
      await conn.query(sql, values);
      conn.end();

      return res.status(200).json({
        type: "success",
        msg: "Tipo de projeto cadastrado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const conn = await connect();

      //Verify if exist project_types with this id
      const [verifyId] = await conn.query(
        "SELECT * FROM project_types WHERE id=?",
        [id]
      );
      if (verifyId.length == 0) {
        conn.end();
        return res.status(400).json({
          type: "error",
          msg: "Tipo de projeto não encontrado",
        });
      }

      const sql = "UPDATE project_types SET name=? WHERE id=?";
      const values = [name, id];
      await conn.query(sql, values);
      conn.end();

      return res.status(200).json({
        type: "success",
        msg: "Tipo de projeto atualizado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist project_types with this id
      const [projectType] = await conn.query(
        "SELECT * FROM project_types WHERE id=?",
        [id]
      );
      if (projectType.length == 0) {
        conn.end();
        return res.status(400).json({
          type: "error",
          msg: "Tipo de projeto não encontrado",
        });
      }
      conn.end();

      return res.status(200).json({
        type: "success",
        project_type: projectType[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist project_types with this id
      const [verifyId] = await conn.query(
        "SELECT * FROM project_types WHERE id=?",
        [id]
      );
      if (verifyId.length == 0) {
        conn.end();
        return res.status(400).json({
          type: "error",
          msg: "Tipo de projeto não encontrado",
        });
      }

      await conn.query("DELETE FROM project_types WHERE id=?", [id]);
      conn.end();

      return res.status(200).json({
        type: "success",
        msg: "Tipo de projeto deletado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
