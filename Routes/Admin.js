const express = require("express");
const adminRoutes = express.Router();
const { trycatch } = require('../utils/tryCatch');
const controller = require("../Controller/AdminLogin");
const productController = require("../Controller/ProductCotroller");

adminRoutes.post("/admin/login", trycatch(controller.getAdmin));
adminRoutes.post("/admin/register", trycatch(controller.postAdmin));
adminRoutes.post("/admin/delete", trycatch(controller.deleteAdmin));

//adminRoutes.post("/admin/products", productController.addProduct);

module.exports = adminRoutes;
