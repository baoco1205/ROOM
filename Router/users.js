const express = require("express");
var routerUsers = express.Router();
const userController = require("../controler/usersController");

routerUsers.get("/users", userController.getUser);
routerUsers.post("/users", userController.createUser);
routerUsers.post("/users/khachhang", userController.createCustomer);
routerUsers.put("/users", (req, res) => userController.updateUser);
routerUsers.delete("/users", (req, res) => userController.deleteUser);

module.exports = routerUsers;
