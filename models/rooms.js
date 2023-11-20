const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../CONST");
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const roomsSchema = new Schema(
  {
    roomSize: Number,
    numberCustomer: Number,
    floor: Number,
    status: Number,
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "rooms" }
);
const roomsModel = mongoose.model("rooms", roomsSchema);
module.exports = roomsModel;
