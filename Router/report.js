const express = require("express");
var routerReport = express.Router();
const routerReportFirst = express.Router();
const reportControl = require("../controller/reportController");
const { checkAuth } = require("../middleware/checkPassport");

const checkRole = require("../middleware/checkRole");

routerReportFirst.use("/report", checkAuth, routerReport);
routerReport.get(
  "/getreport",
  checkRole.checkRoleManager,
  reportControl.getReport
);
routerReport.get(
  "/myreport",
  checkRole.checkRoleUser,
  reportControl.getMyReport
);
routerReport.post(
  "/createreport",
  checkRole.checkRoleUser,
  reportControl.createReport
);
routerReport.put("/updatereport", reportControl.updateReport);
routerReport.delete(
  "/deletereport",
  checkRole.checkRoleManager,
  reportControl.deleteReport
);

module.exports = routerReportFirst;
