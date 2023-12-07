const express = require("express");
const router = express.Router();
const routerReport = require("./report.js");
const usersRouter = require("./users.js");
const roomsRouter = require("./rooms.js");
const requestsRouter = require("./requests.js");

router.use("/report", routerReport);
router.use("/users", usersRouter);
router.use("/room", roomsRouter);
router.use("/request", requestsRouter);
module.exports = router;
