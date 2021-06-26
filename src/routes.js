const { Router } = require("express");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const StateController = require("./controllers/StateController");
const CityController = require("./controllers/CityController");
const ProjectController = require("./controllers/ProjectController");

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
routes.get("/verify-email/:email", UserController.verifyEmail);

//State
routes.get("/state", StateController.index);

//City
routes.get("/city", CityController.index);

//Project
routes.post("/project/register", ProjectController.store);
routes.put("/project/:id/update", ProjectController.update);
routes.get("/project/:id", ProjectController.show);
routes.delete("/project/:id", ProjectController.destroy);

module.exports = routes;
