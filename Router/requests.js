const express = require("express");
var routerRequests = express.Router();
var requestController = require("../controller/requetsController");
var checkRole = require("../middleware/checkRole");
var checkLogin = require("../controller/checkLogin");

routerRequests.get(
  "/request",
  checkRole.checkRoleUser,
  requestController.getRequest
);
routerRequests.post(
  "/request",
  checkRole.checkRoleUser,
  requestController.createRequest
);
routerRequests.put(
  "/request",
  checkRole.checkRoleUser,
  requestController.changeDateRequestAndUpdate
);
routerRequests.delete(
  "/request",
  checkRole.checkRoleManager,
  requestController.deleteRequest
);

module.exports = routerRequests;
