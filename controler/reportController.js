const reportsModel = require("../models/reports");
const roomsModel = require("../models/rooms");
const usersModel = require("../models/users");
const checkRole = require("./checkRole");
const UNSENT = 0;
const SENT = 1;
var getReportByDate = (req, res) => {
  var username = req.body.username;
  var date = req.body.date;

  usersModel
    .find({ username: username, date: date })
    .then((data) => {
      if (data.role === 0) {
        reportsModel
          .find({ username: username })
          .then((data) => {
            res.json(data);
          })
          .catch((err) => res.json(err));
        res.json;
      } else {
        reportsModel
          .find({ date: date })
          .then((data) => {
            res.json(data);
          })
          .catch((err) => {
            res.json(err);
          });
      }
    })
    .catch((err) => {
      res.json(err);
    });
};
var getReport =
  (checkRole.checkRoleManager,
  (req, res, next) => {
    roomsModel
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  });
var createReport = (req, res, next) => {
  var { username, date, numberParty, info, contractsNumber, status } = req.body;
  reportsModel
    .create({
      numberParty: numberParty,
      info: info,
      contractsNumber: contractsNumber,
      status: 0,
      username: username,
      date: date,
    })
    .then((data) => {
      res.json({ message: "Add reporst success", id: data._id });
    })
    .catch((err) => {
      res.json(err);
    });
};
var updateReport = (req, res, next) => {
  var status = req.body.status;
  var id = req.body._id;
  if (status === 0) {
    reportsModel
      .findByIdAndUpdate(id, {
        numberParty: numberParty,
        contractsNumber: contractsNumber,
        info: info,
      })
      .then((data) => {
        res.json("UPDATE SUCCESS");
      })
      .catch((err) => res.json(err));
  } else {
    res.json("THIS REPORT SENT BEFORE");
  }
};
var deleteSingReport =
  (checkRole.checkRoleManager,
  (req, res, next) => {
    var id = req.body._id;
    reportsModel
      .findByIdAndDelete(id)
      .then((data) => {
        res.json("Delete succsess");
      })
      .catch((err) => {
        res.json(err);
      });
  });
var deleteManyReport =
  (checkRole.checkRoleManager,
  (req, res) => {
    var idList = req.body._id;
    console.log(idList);
    reportsModel
      .deleteMany({ _id: { $in: idList } })
      .then((data) => {
        res.json("Delete success");
      })
      .catch((err) => {
        res.status(500).json(err);
      })

      .catch((err) => {});
  });
module.export = {
  createReport,
  updateReport,
  deleteSingReport,
  deleteManyReport,
  getReport,
  getReportByDate,
};
