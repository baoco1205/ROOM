const express = require("express");
var routerRooms = express.Router();
const roomControler = require("../controler/roomsController");
const roomsModel = require("../models/rooms");

routerRooms.get("/room", roomControler.getRoom);
routerRooms.post("/room", roomControler.getRoom);
routerRooms.put("/room", roomControler.getRoom);
routerRooms.delete("/room", roomControler.getRoom);

module.exports = routerRooms;
