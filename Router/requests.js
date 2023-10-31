const express = require("express");
var routerRequests = express.Router();
var requestController = require("../controler/requetsController");

routerRequests.get("/request/:requestId", requestController.getRequest);
routerRequests.post("/request", requestController.createRequest);
routerRequests.put("/request", requestController.updateRequest);
routerRequests.delete("/request", requestController.deleteRequest);

module.exports = routerRequests;
