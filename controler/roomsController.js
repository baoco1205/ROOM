const roomsModel = require("../models/rooms");
const checkRole = require("./checkRole");
var getRoom = (req, res) => {
  var status = req.body.status;
  if (status) {
    roomsModel
      .find({ status: 1 })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
  roomsModel
    .find({})
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
var createRoom =
  (checkRole.checkRoleManager,
  (req, res) => {
    var { roomSize, numberCustomer, floor, status } = req.body;

    roomsModel
      .create({
        roomSize: roomSize,
        numberCustomer: numberCustomer,
        floor: floor,
        status: status,
      })
      .then((data) => {
        var id = data._id;
        res.json({ message: "Create room complete!!", id: id });
      })
      .catch((err) => res.status(500).json("Create fails, have error: " + err));
  });

var updateRoom =
  (checkRole.checkRoleManager,
  (req, res) => {
    var id = req.body._id;
    // var objectId = mongoose.Types.ObjectId(id);
    var { roomSize, numberCustomer, floor, status } = req.body;
    roomsModel
      .findByIdAndUpdate(
        id,
        {
          roomSize: roomSize,
          numberCustomer: numberCustomer,
          floor: floor,
          status: status,
        },
        { new: false }
      )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.status(500).json("Create fails, have erro: " + err));
  });
var deleteRoom =
  (checkRole.checkRoleAdmin,
  (req, res) => {
    roomsModel
      .findByIdAndDelete(id)
      .then(() => {
        res.json("DELETE SUCCESS");
      })
      .catch((err) => res.status(500).json("DELETE FAILS: " + err));
  });
module.exports = { updateRoom, createRoom, getRoom, deleteRoom };
