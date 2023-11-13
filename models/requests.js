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
    numberCustomer: Number,
    status: Number, //on doing off  === 0 1 2
    floor: Number,
    deleted: Number,
  },
  { collection: "requests" }
);
const requestsModel = mongoose.model("requests", requestsSchema);
module.exports = requestsModel;
