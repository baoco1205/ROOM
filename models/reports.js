const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const reportsSchema = new Schema(
  {
    numberParty: String,
    info: String,
    contractsNumber: String,
    status: String,
    username: String,
    date: String,
  },
  { collection: "reports" }
);
const reportsModel = mongoose.model("reports", reportsSchema);
module.exports = reportsModel;
