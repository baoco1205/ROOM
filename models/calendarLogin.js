const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const calendarSchema = new Schema(
  { timeLogin: String, timeLogout: String, username: String, token: String },
  { collection: "calendarLogin" }
);
const calendarLoginModel = mongoose.model("calendarLogin", calendarSchema);
module.exports = calendarLoginModel;
