const { Router } = require("express");
const ProjectController = require("./app/controllers/ProjectController");

const routes = Router();

routes.get("/projects", ProjectController.getAllProgrammers);
routes.post("/projects", ProjectController.createProgrammer);
routes.get("/projects/:id", ProjectController.getProgrammer);
routes.put("/projects/:id", ProjectController.updateProgrammer);
routes.delete("/projects/:id", ProjectController.deleteProgrammer);

module.exports = routes;
