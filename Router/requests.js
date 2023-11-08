const express = require("express");
var routerRequests = express.Router();
var requestController = require("../controler/requetsController");
var checkRole = require("../controler/checkRole");
var checkLogin = require("../controler/checkLogin");

routerRequests.get(
  "/request",
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  requestController.getRequest
);
routerRequests.post(
  "/request",
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  requestController.createRequest
);
routerRequests.put(
  "/request",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  requestController.updateRequest
);
routerRequests.delete(
  "/request",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  requestController.deleteRequest
);

module.exports = routerRequests;
