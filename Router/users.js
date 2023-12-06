const express = require("express");
var routerUsers = express.Router();
const userController = require("../controller/usersController");
const checkRole = require("../middleware/checkRole");
// const checkLogin = require("../Deleted/checkLogin");
const checkAuth = require("../middleware/checkPassport");
const passport = require("passport");

//middleware
routerUsers.use("", checkAuth.checkAuth);
// routerUsers.use(passport.authenticate("jwt", { session: false }));

routerUsers.get("", checkRole.checkRoleManager, userController.getUser);
routerUsers.post("", checkRole.checkRoleManager, userController.createUser);
//xem thong tin ban than
routerUsers.post("/myinfo", userController.getMyInfo);
routerUsers.post(
  "/updatemyself",
  // checkLogin.checkLogin,
  userController.updateMySelf
);

//update user
routerUsers.put("", checkRole.checkRoleManager, userController.updateUser);
//delete user
routerUsers.delete("", checkRole.checkRoleManager, userController.deleteUser);
routerUsers.post(
  "/softdelete",
  checkRole.checkRoleManager,
  userController.softDelete
);
routerUsers.post(
  "/sortusers",
  checkRole.checkRoleUser,
  userController.sortByName
);
module.exports = routerUsers;
