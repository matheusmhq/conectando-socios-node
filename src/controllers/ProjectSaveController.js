const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { query, idType, idUser, idState, idCity } = req.query;

    var sql =
      "SELECT project.*, user.name, project_types.name AS typeName, state.uf, city.nome AS cityName, project_save.id AS projectSaveId FROM project_save INNER JOIN project ON project.id = project_save.idProject INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id INNER JOIN state ON user.idState = state.id INNER JOIN city ON user.idCity = city.id";

    var filters = [];
    if (query != "" && query != undefined) {
      sql += ` ${
        filters.length == 0 ? "WHERE" : "AND"
      } CONCAT(project.title, project.description) LIKE ?`;
      filters.push("%" + query + "%");
    }
    if (idType != 0 && idType != undefined) {
      sql += ` ${filters.length == 0 ? "WHERE" : "AND"} project.idType=?`;
      filters.push(idType);
    }
    if (idUser != 0 && idUser != undefined) {
      sql += ` ${filters.length == 0 ? "WHERE" : "AND"} project_save.idUser=?`;
      filters.push(idUser);
    }
    if (idState != 0 && idState != undefined) {
      sql += ` ${filters.length == 0 ? "WHERE" : "AND"} user.idState=?`;
      filters.push(idState);
    }
    if (idCity != 0 && idCity != undefined) {
      sql += ` ${filters.length == 0 ? "WHERE" : "AND"} user.idCity=?`;
      filters.push(idCity);
    }

    try {
      const conn = await connect();

      const [list] = await conn.query(
        sql + " ORDER BY project_save.createdAt DESC",
        filters
      );
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
    const { idUser, idProject } = req.body;

    try {
      const conn = await connect();

      const sql =
        "INSERT INTO project_save(idUser, idProject, createdAt, updatedAt) VALUES (?,?,?,?)";
      const values = [idUser, idProject, new Date(), new Date()];
      const [result] = await conn.query(sql, values);
      conn.end();

      return res.status(200).json({
        type: "success",
        msg: "Projeto salvo com sucesso",
        id: result.insertId,
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
        conn.end();
        return res.status(400).json({
          type: "error",
          msg: "Registro não encontrado",
        });
      }

      await conn.query("DELETE FROM project_save WHERE id=?", [id]);
      conn.end();

      return res.status(200).json({
        type: "success",
        msg: "Projeto removido com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
