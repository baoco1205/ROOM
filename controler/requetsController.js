const express = require("express");
const requestModel = require("../models/requests");

var getRequest = (req, res, next) => {
  var { key, valueKey } = req.body;
  if (key) {
    switch (key) {
      case "date": {
        requestModel
          .find({ date: valueKey })
          .then((data) => {
            res.json({ message: "GET DATA FOR DATE", data: data });
          })
          .catch((err) => {
            var error = new Error("GET REQUEST FAILS!!!: " + err);
            error.statusCode = 500;
            throw error;
          });
        break;
      }

      case "status": {
        requestModel
          .find({ status: valueKey })
          .then((data) => {
            res.json({ message: "GET DATA FOR DATE", data: data });
          })
          .catch((err) => {
            var error = new Error("GET REQUEST FAILS!!!: " + err);
            error.statusCode = 500;
            throw error;
          });
        break;
      }
    }
  } else {
    requestModel
      .find({})
      .then((data) => {
        res.json({ message: "GET REQUEST SUCCESS", data: data });
      })
      .catch((err) => {
        var error = new Error("CAN'T NOT GET YOUR REPORT" + err);
        error.statusCode = 400;
        throw error;
      });
  }
};
var createRequest = (req, res, next) => {
  var { date, numberCustomer, status, floor } = req.body;

  requestModel
    .findOne({ date: date, floor: floor })
    .then((data) => {
      if (data) {
        res.json({ message: "DUPLICATED INFO" });
      } else {
        requestModel
          .create({
            date: date,
            numberCustomer: numberCustomer,
            status: status,
            floor: floor,
            deleted: 0,
          })
          .then((data) => {
            res.json({ message: "CREATE SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error();
            error.statusCode = 404;
            throw error;
          });
      }
    })
    .catch((err) => {
      var error = new Error();
      error.statusCode = 404;
      throw error;
    });
};
var deleteRequest = (req, res, next) => {
  var { idList } = req.body;
  requestModel
    .deleteMany({ _id: { $in: idList } })
    .then((data) => {
      res.json({ message: "DELETE SUCCESS", data: data });
    })
    .catch((err) => {
      var error = new Error();
      error.statusCode = 404;
      throw error;
    });
};
var changeDateRequestAndUpdate = (req, res, next) => {
  var { _id, date, numberCustomer, floor } = req.body;
  requestModel
    .findOne({ date: date, floor: floor })
    .then((data) => {
      if (data) {
        console.log(data);
        res.json({ message: "UPDATE FAILS, DATE AND FLOOR IS DUPLICATED" });
      } else {
        requestModel
          .findById({ _id: _id })
          .then((data) => {
            if (data) {
              requestModel
                .create({
                  numberCustomer: data.numberCustomer,
                  floor: floor,
                  date: date,
                  status: 1,
                  deleted: 0,
                })
                .then((data) => res.json({ message: "CHANGE DATA SUCCESS" }))
                .catch((err) => {
                  var error = new Error();
                  error.statusCode = 404;
                  throw error;
                });
            } else {
              res.json("WRONG ID");
            }
          })
          .catch((err) => {
            var error = new Error();
            error.statusCode = 404;
            throw error;
          });
      }
    })
    .catch((err) => {
      var error = new Error();
      error.statusCode = 404;
      throw error;
    });
};
var updateRequest = (req, res, next) => {};

module.exports = {
  createRequest,
  deleteRequest,
  changeDateRequestAndUpdate,
  updateRequest,
  getRequest,
};
