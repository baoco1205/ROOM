const express = require("express");
var routerReport = express.Router();
const reportControl = require("../controler/reportController");
const reportsModel = require("../models/reports");

routerReport.get("/report");
routerReport.post("/report");
routerReport.put("/report");
routerReport.delete("/report");

module.exports = routerReport;
