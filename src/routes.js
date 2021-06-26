const { Router } = require("express");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const StateController = require("./controllers/StateController");
const CityController = require("./controllers/CityController");
const ProjectController = require("./controllers/ProjectController");
const ProjectTypesController = require("./controllers/ProjectTypesController");

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
routes.get("/projects", ProjectController.index);
routes.post("/project/register", ProjectController.store);
routes.put("/project/:id/update", ProjectController.update);
routes.get("/project/:id", ProjectController.show);
routes.delete("/project/:id", ProjectController.destroy);

//Project Types
routes.get("/project-types", ProjectTypesController.index);
routes.post("/project-types/register", ProjectTypesController.store);
routes.put("/project-types/:id/update", ProjectTypesController.update);
routes.get("/project-types/:id", ProjectTypesController.show);
routes.delete("/project-types/:id", ProjectTypesController.destroy);

module.exports = routes;
