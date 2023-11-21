const express = require("express");
var routerReport = express.Router();
const reportControl = require("../controller/reportController");

const checkRole = require("../middleware/checkRole");

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
