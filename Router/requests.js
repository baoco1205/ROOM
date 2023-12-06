///NPM

const express = require("express");
var routerRequests = express.Router();
var requestController = require("../controller/requetsController");
var checkRole = require("../middleware/checkRole");
// var checkLogin = require("../controller/checkLogin");
const checkAuth = require("../middleware/checkPassport");

routerRequests.post("/is_booking", requestController.isBooking);

//middware checkAuth
routerRequests.use("", checkAuth.checkAuth);
//

routerRequests.post(
  "/checkrequest",
  checkRole.checkRoleUser,
  requestController.findRequest
);
// routerRequests.get(checkRole.checkRoleUser, requestController.getRequest);
routerRequests.post(
  "/request/cancelRequest",
  checkRole.checkRoleUser,
  requestController.cancelRequest
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
