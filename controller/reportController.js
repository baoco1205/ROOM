const { report } = require("../Router/report");
const reportsModel = require("../models/reports");
const roomsModel = require("../models/rooms");
const usersModel = require("../models/users");
const checkRole = require("../middleware/checkRole");
const Joi = require("@hapi/joi");
const { REPORT_SENT, NOW, DELETE, CHECK_SCHEMA } = require("../CONST");
const response = require("./response");

var getReport = (req, res, next) => {
  let { username, id } = req.body;
  if (username || id) {
    let dieuKienLoc = req.body;
    let condition = {};
    Object.keys(dieuKienLoc).forEach((key) => {
      condition[key] = dieuKienLoc[key];
    });
    console.log(condition);
    reportsModel
      .find({ condition })
      .then((data) => {
        if (data.length === 0)
          return response.response(res, undefined, "Pls try input condition");
      })
      .catch((err) => {
        return response.responseError(res, err);
      });
  }
  reportsModel
    .find()
    .then((data) => {
      if (data.length === 0)
        return response.response(
          undefined,
          undefined,
          "Don't have condition satisfy"
        );
      return response.response(res, data);
    })
    .catch((err) => {
      return response.responseError(res, err);
    });
};
var getMyReport = (req, res, next) => {
  var username = req.user.username;
  reportsModel
    .find({ username: username })
    .then((data) => {
      response.response(res, data, "Get report success");
    })
    .catch((err) => {
      var error = new Error("CAN'T NOT GET YOUR REPORT" + err);
      error.statusCode = 400;
      throw error;
    });
};
var createReport = (req, res, next) => {
  // var dateCreate = new Date().toLocaleString("vi-VN");
  var dateCreate = NOW;
  let { username } = req.user;

  var { numberParty, info, contractsNumber, date } = req.body;
  CHECK_SCHEMA.CHECK_CREATE_REPORT.validateAsync(req.body, {
    allowUnknown: false,
  })
    .then((payload) => {
      reportsModel
        .aggregate([{ $match: { dateCreate: dateCreate } }])
        .then((data) => {
          if (data) {
            return res.json({ message: "Today you already reported" });
          }
          reportsModel
            .create({
              numberParty: numberParty,
              info: info,
              contractsNumber: contractsNumber,
              username: username,
              date: date,
              dateCreate: NOW,
              deleted: DELETE.UNDELETED,
            })
            .then((data) => {
              res.json({ message: "CREATE SUCCESS", data: data });
            });
        });
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
