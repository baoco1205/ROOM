const roomsModel = require("../models/rooms");
const usersModel = require("../models/users");
const checkRole = require("./checkRole");
const FREE = 1;
const DOING = 0;
var getRoom = (req, res) => {
  var { status, key, valueKey } = req.body;

  if (key) {
    if (key === "roomSize") {
      roomsModel
        .find({ roomSize: { $lt: `${valueKey}` } })
        .then((data) => {
          console.log(valueKey);
          res.json({ message: "GET SUCCESS", data: data });
        })
        .catch((err) => {
          const error = new Error(
            "GET VALUE BY ROOM SIZE FAILS BECAUSE: " + err
          );
          error.statusCode(400);
          throw error;
        });
    }
  } else {
    roomsModel
      .find()
      .then((data) => {
        res.json({ Message: "GET ROOM SUCCESS", data: data });
      })
      .catch((err) => {
        var error = new Error();
        error.statusCode = 400;
        throw error;
      });
  }
};
var createRoom = (req, res) => {
  var { roomSize, numberCustomer, floor } = req.body;
  //status có 2 dạng free =0 or doing =1
  if (roomSize && numberCustomer && floor) {
    roomsModel
      .create({
        roomSize: roomSize,
        numberCustomer: numberCustomer,
        floor: floor,
        status: 0,
        deleted: 0,
      })
      .then((data) => {
        var id = data._id;
        res.json({ message: "Create room complete!!", id: id });
      })
      .catch((err) => res.status(500).json("Create fails, have error: " + err));
  } else {
    res.status(400).json({ message: "NOT ENOUG INFORMATION" });
  }
};

var updateRoom = (req, res) => {
  var id = req.body._id;
  console.log(id);
  // var objectId = mongoose.Types.ObjectId(id);
  var { roomSizeNew, numberCustomerNew, floorNew, statusNew } = req.body;
  if (roomSizeNew && numberCustomerNew && floorNew && statusNew) {
    roomsModel
      .findByIdAndUpdate(
        id,
        {
          roomSize: roomSizeNew,
          numberCustomer: numberCustomerNew,
          floor: floorNew,
          status: statusNew,
        },
        { new: false }
      )
      .then((data) => {
        if (data) {
          res.json({ message: "UPDATE SUCCESS", data: data });
        } else {
          console.log(data);
          res.status(400).json("UPDATE FAILS");
        }
      })
      .catch((err) => {
        var error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  } else {
    res.status(400).json({ message: "UPDATE FAILS BECAUSE MISS INFO" });
  }
};
var deleteRoom = (req, res) => {
  var id = req.body._id;
  console.log("aaaaaaaaaa" + id);
  roomsModel
    .findByIdAndDelete({ _id: id })
    .then((data) => {
      if (data) {
        res.json({ message: "DELETE SUCCESS", data: data });
      } else {
        res.json({ message: "PLS CHECK ID" });
      }
    })
    .catch((err) => {
      const error = new Error();
    });
};
var updateStatus = (req, res) => {
  var { _id, newStatus } = req.body;
  roomsModel
    .findByIdAndUpdate({ _id }, { status: newStatus })
    .then((data) => {
      console.log(data);
      res.json("UPDATE STATUS SUCCESS");
    })
    .catch((err) => {
      var error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
};
module.exports = { updateRoom, createRoom, getRoom, deleteRoom, updateStatus };
