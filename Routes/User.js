const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const reg_logController = require("../Controller/userReg-Login")
const authentication = require("../Middlewares/auth");
const { trycatch } = require("../utils/tryCatch");

usersRoute.post("/users/register", trycatch(reg_logController.userRegister));
usersRoute.post("/users/login", trycatch(reg_logController.userLogin));
usersRoute.get("/users/products", authentication, trycatch(controller.userProducts));
usersRoute.get(
  "/users/products/:id",
  authentication,
  trycatch(controller.userProductById)
);
usersRoute.get(
  "/users/products/category/:categoryname",
  authentication,
  trycatch(controller.userProductByCategory)
);
usersRoute.post("/users/cart", authentication, trycatch(controller.addCartItems));
usersRoute.get("/users/cart", authentication, trycatch(controller.readCart));
usersRoute.post(
  "/users/:id/wishlists",
  authentication,
  trycatch(controller.addToWishList)
);
usersRoute.get("/users/:id/wishlists", authentication, trycatch(controller.readWishList));
usersRoute.delete(
  "/users/:id/wishlists",
  authentication,
  trycatch(controller.deleteWishItem)
);

module.exports = usersRoute;
