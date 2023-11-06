const express = require("express");
var routerUsers = express.Router();
const userController = require("../controler/usersController");
const checkRole = require("../controler/checkRole");
const checkLogin = require("../controler/checkLogin");

routerUsers.get(
  "/users",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  userController.getUser
);
routerUsers.post(
  "/users",
  checkRole.checkRoleManager,
  userController.createUser
);
//xem thong tin ban than
routerUsers.post(
  "/users/myinfo",
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  userController.getMyInfo
);
// routerUsers.post("/users/khachhang", userController.createCustomer);
//update user
routerUsers.put("/users", checkLogin.checkLogin, userController.updateUser);
routerUsers.delete(
  "/users",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  userController.deleteUser
);

module.exports = routerUsers;
