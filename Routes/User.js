const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const reg_logController = require("../Controller/userReg-Login")
const { userAuthentication } = require("../Middlewares/auth");
const { trycatch } = require("../utils/tryCatch");

usersRoute.post("/users/register", trycatch(reg_logController.userRegister));
usersRoute.post("/users/login", trycatch(reg_logController.userLogin));
usersRoute.get("/users/products", userAuthentication, trycatch(controller.userProducts));
usersRoute.get(
  "/users/products/:id",
  userAuthentication,
  trycatch(controller.userProductById)
);
usersRoute.get(
  "/users/products/category/:categoryname",
  userAuthentication,
  trycatch(controller.userProductByCategory)
);
usersRoute.post("/users/cart", userAuthentication, trycatch(controller.addCartItems));
usersRoute.get("/users/cart", userAuthentication, trycatch(controller.readCart));
usersRoute.delete("/users/cart", userAuthentication, trycatch(controller.deleteCart));
usersRoute.post(
  "/users/wishlists",
  userAuthentication,
  trycatch(controller.addToWishList)
);
usersRoute.get("/users/wishlists", userAuthentication, trycatch(controller.readWishList));
usersRoute.delete(
  "/users/wishlists",
  userAuthentication,
  trycatch(controller.deleteWishItem)
);
usersRoute.post("/users/orders", userAuthentication, trycatch(controller.orderCart));

//....... Refresh Token ..........
usersRoute.get("/users/refresh-token", trycatch(reg_logController.refresh));

//Success route
usersRoute.get("/users/success",userAuthentication, trycatch(controller.success));
//Cancel Route
usersRoute.get("/users/cancel",userAuthentication, trycatch(controller.cancel));

module.exports = usersRoute;
