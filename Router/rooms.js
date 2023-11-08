const express = require("express");
var routerRooms = express.Router();
const roomControler = require("../controler/roomsController");
const roomsModel = require("../models/rooms");
const checkLogin = require("../controler/checkLogin");
const checkRole = require("../controler/checkRole");

routerRooms.get(
  "/room",
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  roomControler.getRoom
);
routerRooms.post(
  "/room",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  roomControler.createRoom
);
routerRooms.put(
  "/room",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  roomControler.updateRoom
);
//done
routerRooms.delete(
  "/room",
  checkLogin.checkLogin,
  checkRole.checkRoleManager,
  roomControler.deleteRoom
);
//done
routerRooms.post(
  "/updateRoomStatus",
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  roomControler.updateStatus
);
module.exports = routerRooms;
