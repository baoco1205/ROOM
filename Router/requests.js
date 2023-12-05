///NPM

const express = require("express");
var routerRequests = express.Router();
var requestController = require("../controller/requetsController");
var checkRole = require("../middleware/checkRole");
// var checkLogin = require("../controller/checkLogin");
const checkAuth = require("../middleware/checkPassport");

//middware
routerRequests.use(checkAuth.checkAuth);

routerRequests.get(
  "/request",
  checkRole.checkRoleUser,
  requestController.getRequest
);
routerRequests.post(
  "/request/cancelRequest",
  checkRole.checkRoleUser,
  requestController.cancelRequest
);
routerRequests.post(
  "/request/checkrequest",
  checkRole.checkRoleUser,
  requestController.findRequest
);
routerRequests.post(
  "/request/booking",
  checkRole.checkRoleUser,
  requestController.createRequest
);
routerRequests.post(
  "/request/updaterequest",
  checkRole.checkRoleUser,
  requestController.updateRequest
);
routerRequests.delete(
  "/request",
  checkRole.checkRoleManager,
  requestController.deleteRequest
);

module.exports = routerRequests;
