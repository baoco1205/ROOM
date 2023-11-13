const express = require("express");
var routerReport = express.Router();
const reportControl = require("../controler/reportController");

const checkRole = require("../controler/checkRole");

routerReport.get("/report", reportControl.getReport);
routerReport.get("/report/myreport", reportControl.getMyReport);
routerReport.post(
  "/report",
  checkRole.checkRoleUser,
  reportControl.createReport
);
routerReport.put("/report", reportControl.updateReport);
routerReport.delete(
  "/report",
  checkRole.checkRoleManager,
  reportControl.deleteReport
);

module.exports = routerReport;
