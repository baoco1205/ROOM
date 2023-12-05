const express = require("express");
var routerUsers = express.Router();
const userController = require("../controller/usersController");
const checkRole = require("../middleware/checkRole");
// const checkLogin = require("../Deleted/checkLogin");
const checkAuth = require("../middleware/checkPassport");
const passport = require("passport");

//middleware
routerUsers.use("/users", checkAuth.checkAuth);
// routerUsers.use(passport.authenticate("jwt", { session: false }));

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
  // checkLogin.checkLogin,
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
routerUsers.post(
  "/users/softdelete",
  checkRole.checkRoleManager,
  userController.softDelete
);
routerUsers.post(
  "/users/sortusers",
  checkRole.checkRoleUser,
  userController.sortByName
);
module.exports = routerUsers;
