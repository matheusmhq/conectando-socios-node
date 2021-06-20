const { Router } = require("express");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Bem vindo ao Conectando Sócios!" });
});

//Auth
routes.post("/user/login", AuthController.login);

//User
routes.post("/user/register", UserController.store);
routes.put("/user/:id/update", UserController.update);
routes.get("/user/:id", UserController.show);

module.exports = routes;
