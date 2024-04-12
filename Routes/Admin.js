const express = require("express");
const adminRoutes = express.Router();
const { trycatch } = require('../utils/tryCatch');
const controller = require("../Controller/AdminLogin");
const { adminAuthentication } = require("../Middlewares/auth");
const adminController = require('../Controller/AdminForm');

adminRoutes.post("/admin/login", trycatch(controller.getAdmin));
adminRoutes.post("/admin/register", adminAuthentication, trycatch(controller.postAdmin));
adminRoutes.delete("/admin/delete", adminAuthentication, trycatch(controller.deleteAdmin));

adminRoutes.get("/admin/users", adminAuthentication, trycatch(adminController.getUsers));
adminRoutes.get("/admin/users/:id", adminAuthentication, trycatch(adminController.getUser));
adminRoutes.get("/admin/products", adminAuthentication, trycatch(adminController.getProducts));
adminRoutes.get("/admin/products/category", adminAuthentication, trycatch(adminController.getProductCategory));
adminRoutes.get("/admin/products/:id", adminAuthentication, trycatch(adminController.getproduct));
adminRoutes.post("/admin/products", adminAuthentication, trycatch(adminController.addProduct));
adminRoutes.put("/admin/products/:id", adminAuthentication, trycatch(adminController.updateProduct));
adminRoutes.delete("/admin/products/:id", adminAuthentication, trycatch(adminController.deleteProduct));
adminRoutes.get("/admin/status", adminAuthentication, trycatch(adminController.status));
adminRoutes.get("/admin/orders", adminAuthentication, trycatch(adminController.orderProducts));

module.exports = adminRoutes;
