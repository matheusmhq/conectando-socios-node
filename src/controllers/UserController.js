const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async store(req, res) {
    const {
      name,
      email,
      password,
      whatsapp,
      facebook,
      linkedin,
      instagram,
      twitter,
      cep,
      idCity,
      idState,
      address,
      number,
      district,
      complement,
    } = req.body;
    var passwordHash = await bcrypt.hash(password, 10);

    try {
      const conn = await connect();

      //Verify if email has register
      const [verifyEmail] = await conn.query(
        "SELECT * FROM user WHERE email=?",
        [email]
      );
      if (verifyEmail.length > 0) {
        return res.status(400).json({
          type: "error",
          msg: "Esse e-mail já está cadastrado no sistema",
        });
      }

      const sql =
        "INSERT INTO user(name, email, password, whatsapp, facebook, linkedin, instagram, twitter, cep, idCity, idState, address, number, district, complement, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const values = [
        name,
        email,
        passwordHash,
        whatsapp,
        facebook,
        linkedin,
        instagram,
        twitter,
        cep,
        idCity,
        idState,
        address,
        number,
        district,
        complement,
        new Date(),
        new Date(),
      ];
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
    const {
      name,
      email,
      whatsapp,
      facebook,
      linkedin,
      instagram,
      twitter,
      cep,
      idCity,
      idState,
      address,
      number,
      district,
      complement,
    } = req.body;

    try {
      const conn = await connect();

      //Verify if exist account with this id
      const [verifyId] = await conn.query("SELECT * FROM user WHERE id=?", [
        id,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Usuário não encontrado",
        });
      }

      //Verify if email has register
      const [verifyEmail] = await conn.query(
        "SELECT * FROM user WHERE email=?",
        [email]
      );
      if (verifyEmail.length > 0) {
        return res.status(400).json({
          type: "error",
          msg: "Esse e-mail já está cadastrado no sistema",
        });
      }

      const sql =
        "UPDATE user SET name=?, email=?, whatsapp=?, facebook=?, linkedin=?, instagram=?, twitter=?, cep=?, idCity=?, idState=?, address=?, number=?, district=?, complement=?, updatedAt=? WHERE id=?";
      const values = [
        name,
        email,
        whatsapp,
        facebook,
        linkedin,
        instagram,
        twitter,
        cep,
        idCity,
        idState,
        address,
        number,
        district,
        complement,
        new Date(),
        id,
      ];
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
      const [verifyId] = await conn.query("SELECT * FROM user WHERE id=?", [
        id,
      ]);
      if (verifyId.length == 0) {
        return res.status(400).json({
          type: "error",
          msg: "Usuário não encontrado",
        });
      }

      return res.status(200).json({
        type: "success",
        user: verifyId[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },

  async verifyEmail(req, res) {
    const { email } = req.params;

    try {
      const conn = await connect();

      //Verify if email has register
      const [verifyEmail] = await conn.query(
        "SELECT * FROM user WHERE email=?",
        [email]
      );

      return res.status(200).json({
        type: "success",
        hasRegister: verifyEmail.length == 0 ? false : true,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", msg: error.message });
    }
  },
};
