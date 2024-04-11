const express = require("express");
const adminRoutes = express.Router();
const { trycatch } = require('../utils/tryCatch');
const controller = require("../Controller/AdminLogin");
const authentication = require("../Middlewares/auth");
const productController = require("../Controller/ProductCotroller");

adminRoutes.post("/admin/login", trycatch(controller.getAdmin));
adminRoutes.post("/admin/register",authentication, trycatch(controller.postAdmin));
adminRoutes.delete("/admin/delete",authentication, trycatch(controller.deleteAdmin));

//adminRoutes.post("/admin/products", productController.addProduct);

module.exports = adminRoutes;
