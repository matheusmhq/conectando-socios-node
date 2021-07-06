const bcrypt = require("bcrypt");
const { connect } = require("../db");

//index, show, store, update, destroy

module.exports = {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const conn = await connect();

      //Verify if exist account with this email
      const [verifyEmail] = await conn.query(
        "SELECT * FROM user WHERE email=?",
        [email]
      );
      conn.end();

      if (verifyEmail.length == 0) {
        return res.status(400).json({
          type: "error",
          message: "E-mail ou senha inválidos",
        });
      }

      const user = verifyEmail[0];
      bcrypt.compare(password, user.password, function (err, match) {
        if (match) {
          var obj = {
            id: user.id,
            name: user.name,
            email: user.email,
            whatsapp: user.whatsapp,
            facebook: user.facebook,
            linkedin: user.linkedin,
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

          return res.json({ type: "success", user: obj });
        } else {
          return res.status(400).json({
            type: "error",
            message: "E-mail ou senha inválidos",
          });
        }
      });
    } catch (error) {
      return res.status(400).send({ type: "error", message: error.message });
    }
  },
};
