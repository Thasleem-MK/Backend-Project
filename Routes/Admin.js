const express = require("express");
const adminRoutes = express.Router();
const controller = require("../Controller/AdminForm");
const productController = require("../Controller/ProductCotroller");

adminRoutes.post("/admin/login", controller.getAdmin);
adminRoutes.post("/admin/register", controller.postAdmin);
adminRoutes.post("/admin/delete", controller.deleteAdmin);

adminRoutes.post("/admin/products", productController.addProduct);

module.exports = adminRoutes;
