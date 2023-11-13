const express = require("express");
var routerUsers = express.Router();
const userController = require("../controler/usersController");
const checkRole = require("../controler/checkRole");
const checkLogin = require("../controler/checkLogin");

routerUsers.get("/users", checkRole.checkRoleManager, userController.getUser);
routerUsers.post(
  "/users",
  checkRole.checkRoleManager,
  userController.createUser
);
//xem thong tin ban than
routerUsers.post("/users/myinfo", userController.getMyInfo);
routerUsers.post(
  "/users/updatemyself",
  checkLogin.checkLogin,
  userController.updateMySelf
);

//update user
routerUsers.put(
  "/users",
  checkRole.checkRoleManager,
  userController.updateUser
);
//delete user
routerUsers.delete(
  "/users",
  checkRole.checkRoleManager,
  userController.deleteUser
);

module.exports = routerUsers;
