const mongoose = require("mongoose");
const database = "ROOM";
const ip = "127.0.0.1:27017";
mongoose.connect(`mongodb://${ip}/${database}`).then(() => {});

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    name: String,
    address: String,
    phone: String,
    role: String,
    note: String,
    deleted: Number,
  },
  { collection: "users" }
);
const usersModel = mongoose.model("users", UsersSchema);
module.exports = usersModel;
