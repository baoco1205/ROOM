const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose
  .connect(`mongodb://${ip}/${database}`)
  .then(() => console.log("Connected database!"));

const Schema = mongoose.Schema;

const requestsSchema = new Schema(
  {
    date: Date,
    numberCustomer: String,
    status: String,
    floor: String,
    deleted: String,
  },
  { collection: "requests" }
);
const requestsModel = mongoose.model("requests", requestsSchema);
module.exports = requestsModel;
