const { report } = require("../Router/report");
const reportsModel = require("../models/reports");
const roomsModel = require("../models/rooms");
const usersModel = require("../models/users");
const checkRole = require("./checkRole");
const UNSENT = 0;
const SENT = 1;

var getReport = (req, res, next) => {
  var { key, keyValue } = req.body;
  var role = req.user.data.role;

  if (role >= 3) {
    if (key) {
      if (key === "username") {
        reportsModel
          .find({ username: keyValue })
          .then((data) => {
            console.log("TOI DAY R ");
            res.json({ message: "GET REPORT SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error("CAN'T NOT GET REPORT" + err);
            error.statusCode = 400;
            throw error;
          });
      } else if (key === "date") {
        reportsModel
          .find({ date: keyValue })
          .then((data) => {
            res.json({ message: "GET REPORT SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error("CAN'T NOT GET REPORT" + err);
            error.statusCode = 400;
            throw error;
          });
      }
    } else {
      reportsModel
        .find({})
        .then((data) => {
          res.json({ message: "GET REPORT SUCCESS", data: data });
        })
        .catch((err) => {
          var error = new Error("CAN'T NOT GET REPORT: " + err);
          error.statusCode = 400;
          throw error;
        });
    }
  } else if (role >= 2) {
    if (key) {
      if (key === "username") {
        console.log("vao day k ");
        reportsModel
          .find({ username: keyValue })
          .then((data) => {
            res.json({ message: "GET REPORT SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error("CAN'T NOT GET REPORT" + err);
            error.statusCode = 400;
            throw error;
          });
      } else if (key === "date") {
        reportsModel
          .find({ date: keyValue })
          .then((data) => {
            res.json({ message: "GET REPORT SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error("CAN'T NOT GET REPORT" + err);
            error.statusCode = 400;
            throw error;
          });
      }
    } else {
      reportsModel
        .find({})
        .then((data) => {
          res.json({ message: "GET REPORT SUCCESS", data: data });
        })
        .catch((err) => {
          var error = new Error("CAN'T NOT GET REPORT" + err);
          error.statusCode = 400;
          throw error;
        });
    }
  } else {
    res.json({ message: "YOUR ROLE NOT ENOUGH" });
  }
};
var getMyReport = (req, res, next) => {
  var username = req.user.data.username;
  reportsModel
    .find({ username: username })
    .then((data) => {
      res.json({ message: "GET SUCCESS", data: data });
    })
    .catch((err) => {
      var error = new Error("CAN'T NOT GET YOUR REPORT" + err);
      error.statusCode = 400;
      throw error;
    });
};
var createReport = (req, res, next) => {
  // var dateCreate = new Date().toLocaleString("vi-VN");
  var dateCreate = new Date();
  var deleted = 0;
  var username = req.user.data.username;

  var { numberParty, info, contractsNumber, date } = req.body;

  reportsModel
    .create({
      numberParty: numberParty,
      info: info,
      contractsNumber: contractsNumber,
      username: username,
      date: date,
      dateCreate: dateCreate,
      deleted: deleted,
    })
    .then((data) => {
      res.json({ message: "CREATE SUCCESS" });
    })
    .catch((err) => {
      var error = new Error("CREATE REPORT FAILS: " + err);
      error.statusCode = 400;
      throw error;
    });
};
var updateReport = (req, res, next) => {
  var { idReport, numberParty, info, contractsNumber } = req.body;

  reportsModel
    .findByIdAndUpdate(idReport, {
      numberParty: numberParty,
      info: info,
      contractsNumber: contractsNumber,
    })
    .then((data) => {
      res.json({ message: "UPDATE REPORT SUCCESS" });
    })
    .catch((err) => {
      var error = new Error("UPDATE REPORT FAILS: " + err);
      error.statusCode = 400;
      throw error;
    });
};
var deleteReport = (req, res) => {
  var idList = req.body._id;
  //file json co dang "_id":["65363f04eb40e7088d7080b0","65363f05eb40e7088d7080b2","65363f06eb40e7088d7080b4"]
  reportsModel
    .deleteMany({ _id: { $in: idList } })
    .then((data) => {
      res.json("Delete success");
    })
    .catch((err) => {
      res.status(500).json(err);
    })

    .catch((err) => {});
};

module.exports = {
  createReport,
  updateReport,
  deleteReport,
  getReport,
  getMyReport,
};
