const express = require("express");
const usersRoute = express.Router();
const controller = require("../Controller/UserController");
const reg_logController = require("../Controller/userReg-Login")
const { userAuthentication } = require("../Middlewares/auth");
const { trycatch } = require("../utils/tryCatch");
const cloudinary = require("../Middlewares/cloudinary");

usersRoute.post("/users/register",cloudinary, trycatch(reg_logController.userRegister));
usersRoute.post("/users/login", trycatch(reg_logController.userLogin));
usersRoute.get("/users/products", trycatch(controller.userProducts));
usersRoute.get(
  "/users/products/:id",
  trycatch(controller.userProductById)
);
usersRoute.get(
  "/users/products/category/:categoryname",
  trycatch(controller.userProductByCategory)
);
usersRoute.get("/users/profile", userAuthentication, trycatch(controller.userProfile));
usersRoute.post("/users/cart", userAuthentication, trycatch(controller.addCartItems));
usersRoute.get("/users/cart", userAuthentication, trycatch(controller.readCart));
usersRoute.delete("/users/cart", userAuthentication, trycatch(controller.deleteCart));
usersRoute.put("/users/cart", userAuthentication, trycatch(controller.decreaseCartItemQuantity));
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

module.exports = usersRoute;
