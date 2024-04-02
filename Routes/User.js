const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const authentication = require("../Middlewares/auth");

usersRoute.post("/users/register", controller.userRegister);
usersRoute.post("/users/login", controller.userLogin);
usersRoute.get("/users/products", authentication, controller.userProducts);
usersRoute.get(
  "/users/products/:name",
  authentication,
  controller.userProductById
);
usersRoute.get(
  "/users/products/category/:categoryname",
  authentication,
  controller.userProductByCategory
);

usersRoute.post(
  "/users/:userName/cart",
  authentication,
  controller.addCartItems
);

module.exports = usersRoute;
