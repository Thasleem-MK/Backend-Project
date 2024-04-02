const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const authentication = require("../Middlewares/auth");

usersRoute.post("/users/register", controller.userRegister);
usersRoute.post("/users/login", controller.userLogin);
usersRoute.get("/users/products", authentication, controller.userProducts);

module.exports = usersRoute;
