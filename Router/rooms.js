const express = require("express");
var routerRooms = express.Router();
const roomControler = require("../controller/roomsController");
const checkRole = require("../middleware/checkRole");
const checkAuth = require("../middleware/checkPassport");
routerRooms.use("", checkAuth.checkAuth);
routerRooms.get("", checkRole.checkRoleUser, roomControler.getRoom);
routerRooms.post("", checkRole.checkRoleManager, roomControler.createRoom);
routerRooms.put("", checkRole.checkRoleManager, roomControler.updateRoom);
//done
routerRooms.delete("", checkRole.checkRoleManager, roomControler.deleteRoom);
//done
routerRooms.post(
  "/updateRoomStatus",
  checkRole.checkRoleUser,
  roomControler.updateStatus
);
module.exports = routerRooms;
