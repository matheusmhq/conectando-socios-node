const { Router } = require("express");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const StateController = require("./controllers/StateController");
const CityController = require("./controllers/CityController");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Bem vindo a api do Conectando Sócios!" });
});

//Auth
routes.post("/user/login", AuthController.login);

//User
routes.post("/user/register", UserController.store);
routes.put("/user/:id/update", UserController.update);
routes.get("/user/:id", UserController.show);

//State
routes.get("/state", StateController.index);

//City
routes.get("/city", CityController.index);

module.exports = routes;
