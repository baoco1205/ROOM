const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
const { DELETE, ROLE } = require("../CONST");
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
    deleted: {
      type: Number,
      enum: [DELETE.UNDELETED, DELETE.DELETED],
      default: 0,
      index: true,
    },
  },
  { collection: "requests" }
);
const requestsModel = mongoose.model("requests", requestsSchema);
module.exports = requestsModel;
