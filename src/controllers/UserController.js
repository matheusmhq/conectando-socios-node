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
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Esse e-mail já está cadastrado no sistema",
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
      conn.end();

      return res.status(200).json({
        type: "success",
        message: "Usuário cadastrado com sucesso",
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Usuário não encontrado",
        });
      }

      //Verify if email has register
      const [verifyEmail] = await conn.query(
        "SELECT * FROM user WHERE email=?",
        [email]
      );
      if (verifyEmail.length > 0 && verifyEmail[0].id != id) {
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Esse e-mail já está cadastrado no sistema",
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

      var [user] = await conn.query("SELECT * FROM user WHERE id=?", [id]);
      user = user[0];
      conn.end();

      var obj = {
        id: user.id,
        name: user.name,
        email: user.email,
        whatsapp: user.whatsapp,
        facebook: user.facebook,
        linkein: user.linkein,
        instagram: user.instagram,
        twitter: user.twitter,
        cep: user.cep,
        idCity: user.idCity,
        idState: user.idState,
        address: user.address,
        number: user.number,
        district: user.district,
        complement: user.complement,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json({
        type: "success",
        message: "Usuário atualizado com sucesso",
        user: obj,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const conn = await connect();

      //Verify if exist account with this id
      const [user] = await conn.query("SELECT * FROM user WHERE id=?", [id]);
      if (user.length == 0) {
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Usuário não encontrado",
        });
      }

      conn.end();
      return res.status(200).json({
        type: "success",
        user: user[0],
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
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

      conn.end();
      return res.status(200).json({
        type: "success",
        hasRegister: verifyEmail.length == 0 ? false : true,
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },

  async changePassword(req, res) {
    const { id, currentPassword, newPassword } = req.body;

    try {
      const conn = await connect();

      //Verify if exist account with this id
      var [user] = await conn.query("SELECT * FROM user WHERE id=?", [id]);
      if (user.length == 0) {
        conn.end();
        return res.status(400).json({
          type: "error",
          message: "Usuário não encontrado",
        });
      }
      user = user[0];

      bcrypt.compare(
        currentPassword,
        user.password,
        async function (err, match) {
          if (match) {
            var passwordHash = await bcrypt.hash(newPassword, 10);
            await conn.query(
              "UPDATE user SET password=?, updatedAt=? WHERE id=?",
              [passwordHash, new Date(), id]
            );

            conn.end();
            return res.json({
              type: "success",
              message: "Senha alterada com sucesso",
            });
          } else {
            conn.end();
            return res.status(400).json({
              type: "error",
              message: "Senha atual inválida",
            });
          }
        }
      );
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },
};
