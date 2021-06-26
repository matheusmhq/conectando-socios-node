const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { query, idType, idUser } = req.query;

    var filters = [];

    var sql =
      "SELECT project.*, user.name, project_types.name AS type_name FROM project_save INNER JOIN project ON project.id = project_save.idProject INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id";

    if (query != "" && query != undefined) {
      filters.push("%" + query + "%");
      sql += " AND CONCAT(project.title, project.description) LIKE ?";
    }
    if (idType != 0 && idType != undefined) {
      filters.push(idType);
      sql += " AND project.idType=?";
    }
    if (idUser != 0 && idUser != undefined) {
      filters.push(idUser);
      sql += " AND project_save.idUser=?";
    }

    try {
      const conn = await connect();

      const [list] = await conn.query(sql, filters);
      return res.status(200).json({
        type: "success",
        data: list,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async store(req, res) {
    const { idUser, idProject } = req.body;

    try {
      const conn = await connect();

      const sql = "INSERT INTO project_save(idUser, idProject) VALUES (?,?)";
      const values = [idUser, idProject];
      await conn.query(sql, values);

      return res.status(200).json({
        type: "success",
        msg: "Projeto salvo com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async destroy(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist project_save with this id
      const [verifyId] = await conn.query(
        "SELECT * FROM project_save WHERE id=?",
        [id]
      );
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Registro não encontrado",
        });
      }

      await conn.query("DELETE FROM project_save WHERE id=?", [id]);

      return res.status(200).json({
        type: "success",
        msg: "Projeto removido com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
