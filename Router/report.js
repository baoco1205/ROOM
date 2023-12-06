const express = require("express");
const routerReport = express.Router();
const reportControl = require("../controller/reportController");
const { checkAuth } = require("../middleware/checkPassport");

const checkRole = require("../middleware/checkRole");

routerReport.use("", checkAuth);
routerReport.post(
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
routerReport.post("/updatereport", reportControl.updateReport);
routerReport.post(
  "/deletereport",
  checkRole.checkRoleManager,
  reportControl.deleteReport
);

module.exports = routerReport;
