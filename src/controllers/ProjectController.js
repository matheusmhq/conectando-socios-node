const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { query, idType, idUser, idState, idCity, all } = req.query;

    var query_project_save = "";
    var left_project_save = "";
    if (idUser != 0 && idUser != undefined && all === "true") {
      query_project_save = ", project_save.id AS projectSaveId";
      left_project_save = ` LEFT JOIN project_save ON (project_save.idUser = ${idUser} AND project_save.idProject = project.id)`;
    }

    var sql = `SELECT project.*, user.name, project_types.name AS typeName, state.uf, city.nome AS cityName${query_project_save} FROM project INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id INNER JOIN state ON user.idState = state.id INNER JOIN city ON user.idCity = city.id${left_project_save}`;

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
    if (idUser != 0 && idUser != undefined && all === "false") {
      sql += ` ${filters.length == 0 ? "WHERE" : "AND"} user.id=?`;
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
        sql + " ORDER BY project.createdAt DESC",
        filters
      );
      conn.end();
      return res.status(200).json({
        type: "success",
        data: list,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },

  async store(req, res) {
    const { idUser, idType, title, description } = req.body;

    try {
      const conn = await connect();

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
      conn.end();

      return res.status(200).json({
        type: "success",
        message: "Projeto cadastrado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Projeto não encontrado",
        });
      }

      const sql =
        "UPDATE project SET idType=?, title=?, description=?, updatedAt=? WHERE id=?";
      const values = [idType, title, description, new Date(), id];
      await conn.query(sql, values);
      conn.end();

      return res.status(200).json({
        type: "success",
        message: "Projeto atualizado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;
    const { idUser } = req.query;

    try {
      const conn = await connect();

      var query_project_save = "";
      var left_project_save = "";
      if (idUser != 0 && idUser != undefined) {
        query_project_save = ", project_save.id AS projectSaveId";
        left_project_save = ` LEFT JOIN project_save ON (project_save.idUser = ${idUser} AND project_save.idProject = project.id)`;
      }

      const sql = `SELECT project.*, user.name, user.whatsapp, user.facebook, user.linkedin, user.instagram, user.twitter, project_types.name AS typeName, project_types.id AS idType, state.uf, city.nome AS cityName${query_project_save} FROM project INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id INNER JOIN state ON user.idState = state.id INNER JOIN city ON user.idCity = city.id${left_project_save} WHERE project.id=?`;

      const [project] = await conn.query(sql, [id]);
      if (project.length == 0) {
        return res.status(400).json({
          type: "error",
          message: "Projeto não encontrado",
        });
      }
      conn.end();

      return res.status(200).json({
        type: "success",
        project: project[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Projeto não encontrado",
        });
      }

      await conn.query("DELETE FROM project WHERE id=?", [id]);
      await conn.query("DELETE FROM project_save WHERE idProject=?", [id]);
      conn.end();

      return res.status(200).json({
        type: "success",
        message: "Projeto deletado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },
};
