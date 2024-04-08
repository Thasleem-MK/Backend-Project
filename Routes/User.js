const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const reg_logController = require("../Controller/userReg-Login")
const authentication = require("../Middlewares/auth");
const { trycatch } = require("../utils/tryCatch");

usersRoute.post("/users/register", trycatch(reg_logController.userRegister));
usersRoute.post("/users/login", trycatch(reg_logController.userLogin));
usersRoute.get("/users/products", authentication, controller.userProducts);
usersRoute.get(
  "/users/products/:id",
  authentication,
  controller.userProductById
);
usersRoute.get(
  "/users/products/category/:categoryname",
  authentication,
  controller.userProductByCategory
);
usersRoute.post("/users/:userId/cart", authentication, controller.addCartItems);
usersRoute.get("/users/:userId/cart", authentication, controller.readCart);
usersRoute.post(
  "/users/:id/wishlists",
  authentication,
  controller.addToWishList
);
usersRoute.get("/users/:id/wishlists", authentication, controller.readWishList);
usersRoute.delete(
  "/users/:id/wishlists",
  authentication,
  controller.deleteWishItem
);

module.exports = usersRoute;
