const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../CONST");
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const reportsSchema = new Schema(
  {
    numberParty: Number,
    info: String,
    contractsNumber: Number,
    username: String,
    date: Date,
    dateCreate: Date,
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "reports" }
);
const reportsModel = mongoose.model("reports", reportsSchema);
module.exports = reportsModel;
