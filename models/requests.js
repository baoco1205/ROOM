const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose
  .connect(`mongodb://${ip}/${database}`)
  .then(() => console.log("Connected database!"));

const Schema = mongoose.Schema;

const requestsSchema = new Schema(
  {
    date: String,
    numberCustomer: String,
    status: String,
    floor: String,
  },
  { collection: "requests" }
);
const requestsModel = mongoose.model("requests", requestsSchema);
module.exports = requestsModel;
