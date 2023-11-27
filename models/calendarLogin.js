const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

var today = new Date();
var datetimeVN = today.toLocaleString("vi-VN");

const calendarSchema = new Schema(
  {
    timeLogin: {
      type: String,
      // enum: [ROLE.USER, ROLE.MANAGER, ROLE.ADMIN], //các giá trị có thể nhập
      default: datetimeVN,
      index: true,
    },
    timeLogout: String,
    username: {
      type: String,
      // enum: [ROLE.USER, ROLE.MANAGER, ROLE.ADMIN], //các giá trị có thể nhập
      // default: datetimeVN,
      index: true,
    },
    token: String,
  },
  { collection: "calendarLogin" }
);
const calendarLoginModel = mongoose.model("calendarLogin", calendarSchema);
module.exports = calendarLoginModel;
