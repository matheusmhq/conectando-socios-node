const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { query, idType, idUser, idState, idCity, page, perPage } = req.query;

    var perPageLocal = perPage || 10;
    var pageLocal = page || 1;
    const offset = (pageLocal - 1) * perPageLocal;

    var sql =
      "SELECT SQL_CALC_FOUND_ROWS project.*, user.name, project_types.name AS typeName, state.uf, city.nome AS cityName, project_save.id AS projectSaveId FROM project_save INNER JOIN project ON project.id = project_save.idProject INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id INNER JOIN state ON user.idState = state.id INNER JOIN city ON user.idCity = city.id";

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
        sql +
          ` ORDER BY project_save.createdAt DESC 
        limit ${perPageLocal} OFFSET ${offset}
        `,
        filters
      );
      var [total] = await conn.query("SELECT FOUND_ROWS()");
      total = total[0]["FOUND_ROWS()"];
      conn.end();

      return res.status(200).json({
        type: "success",
        perPage: parseInt(perPageLocal),
        page: parseInt(page),
        totalResults: total,
        lastPage: total > 1 ? Math.ceil(total / perPageLocal) : 1,
        data: list,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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
        message: "Projeto salvo com sucesso",
        id: result.insertId,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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
          message: "Registro n??o encontrado",
        });
      }

      await conn.query("DELETE FROM project_save WHERE id=?", [id]);
      conn.end();

      return res.status(200).json({
        type: "success",
        message: "Projeto removido com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },
};
