const { connect } = require("../db");

module.exports = {
  async index(req, res) {
    const { query, idType, idUser } = req.query;

    var filters = [];
    var sql =
      "SELECT project.*, user.name, project_types.name AS type_name FROM project INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id";

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
      sql += " AND user.id=?";
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

      const sql =
        "SELECT project.*, user.name, user.whatsapp, user.facebook, user.linkedin, user.instagram, user.twitter, project_types.name AS type_name, city.nome AS city_name, state.nome AS state_name FROM project INNER JOIN user ON project.idUser = user.id INNER JOIN project_types ON project.idType = project_types.id INNER JOIN state ON user.idState = state.id INNER JOIN city ON user.idCity = city.id WHERE project.id=?";
      const [project] = await conn.query(sql, [id]);
      if (project.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Projeto não encontrado",
        });
      }

      return res.status(200).json({
        type: "success",
        project: project[0],
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
      await conn.query("DELETE FROM project_save WHERE idProject=?", [id]);

      return res.status(200).json({
        type: "success",
        msg: "Projeto deletado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
