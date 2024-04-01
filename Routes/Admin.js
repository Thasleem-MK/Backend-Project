const express = require("express");
const routes = express.Router();
const controller = require("../Controller/AdminForm");

routes.post("/admin/login", controller.getAdmin);
routes.post("/admin/register", controller.postAdmin);
routes.post("/admin/delete", controller.deleteAdmin);

module.exports = routes;
