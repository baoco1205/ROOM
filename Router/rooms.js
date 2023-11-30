const express = require("express");
var routerRooms = express.Router();
const roomControler = require("../controller/roomsController");
const checkRole = require("../middleware/checkRole");
const checkAuth = require("../middleware/checkPassport");
routerRooms.use("/room", checkAuth.checkAuth);
routerRooms.get("/room", checkRole.checkRoleUser, roomControler.getRoom);
routerRooms.post("/room", checkRole.checkRoleManager, roomControler.createRoom);
routerRooms.put("/room", checkRole.checkRoleManager, roomControler.updateRoom);
//done
routerRooms.delete(
  "/room",
  checkRole.checkRoleManager,
  roomControler.deleteRoom
);
//done
routerRooms.post(
  "/updateRoomStatus",
  checkRole.checkRoleUser,
  roomControler.updateStatus
);
module.exports = routerRooms;
