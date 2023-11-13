var calendarLogin = require("../models/calendarLogin");

var saveTimeLogin = function (req, res, next) {
  // console.log("req.user", req.user);
  var username = req.body.username;
  var token = req.body.token;
  // console.log("TESTTTOKEN::::" + token);
  var today = new Date();
  var datetimeVN = today.toLocaleString("vi-VN");
  var date = datetimeVN.split(" ")[1];
  calendarLogin
    .create({ timeLogin: datetimeVN, username: username, token: token })
    .then((data) => {
      console.log("SAVE TIME SUCCESS");
      next();
    })
    .catch((err) => {
      res.status(500).json("SAVE FAIL: " + err);
    });
};
var saveTimeLogout = function (req, res, next) {
  var username = req.body.username;
  var id = req.body.id;
  var today = new Date();
  var datetimeVN = today.toLocaleString("vi-VN");
  calendarLogin
    .findOneAndUpdate(
      {
        username: username,
        token: token,
      },
      { $set: { timeLogout: datetimeVN } }
    )
    .then((data) => {
      console.log("SAVE TIME SUCCESS");
      next();
    })
    .catch((err) => res.status(500).json("SAVE FAIL: " + err));
};
module.exports = { saveTimeLogin, saveTimeLogout };
