const { Router } = require("express");
const UserController = require("./controllers/UserController");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Welcome to Conectando Sócios!" });
});

//Users
routes.post("/user/register", UserController.store);
routes.put("/user/:id/update/", UserController.update);
routes.get("/user/:id", UserController.show);

module.exports = routes;
