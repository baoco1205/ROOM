const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const roomsSchema = new Schema(
  {
    roomSize: Number,
    numberCustomer: Number,
    floor: Number,
    status: Number,
    deleted: Number,
  },
  { collection: "rooms" }
);
const roomsModel = mongoose.model("rooms", roomsSchema);
module.exports = roomsModel;
