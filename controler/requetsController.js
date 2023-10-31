const express = require("express");
var routerRequest = express.Router();
const requestModel = require("../models/requests");
const usersModel = require("../models/users");
const checkRole = require("../controler/checkRole1");

var getRequest = (req, res) => {
  var id = req.params.requestId;
  requestModel
    .findById({ id })
    .then((data) => {
      res.json(id);
    })
    .catch((err) => {
      res.status(500).json();
    });
};
var getByDate = (req, res) => {
  var date = req.body.date;
  requestModel
    .find({ date: date })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
};
var createRequest = (req, res) => {
  var { date, numberCustomer, status, floor, idRequest } = body.req;
  requestModel
    .create({
      data: date,
      numberCustomer: numberCustomer,
      status: status,
      floor: floor,
    })
    .then((data) => {
      res.json(" REQUEST CREATE SUCCESS");
    })
    .catch((err) => res.status(500).json(err));
};
var changeDateRequestAndUpdate = (req, res) => {
  var { id, date, numberCustomer, status, floor } = req.body;

  usersModel
    .findById({ _id: id })
    .then((data) => {
      role = data.role;
      //1 la role user
      if (data.date && data.floor) {
        res.json("DATE OR FLOOR IS DUPLICATED");
      } else if (data.role > 1) {
        requestModel
          .findByIdAndUpdate(
            { _id: idRequest },
            {
              date: date,
              numberCustomer: numberCustomer,
              status: status,
              floor: floor,
            },
            new true()
          )
          .then((data) => {
            res.json("UPDATE SUCCESS");
          })
          .catch((err) => {
            res.status(500).json("UPDATE FAILS");
          });
      } else {
        res.jsoN("NOT ENOUGT PERMISSION ");
      }
    })
    .catch((err) => {
      res.json(err);
    });
};
var deleteRequest =
  (checkRole.checkRoleManager,
  (req, res) => {
    var id = body.req.id;
    requestModel
      .findByIdAndDelete({ _id: id })
      .then((data) => {
        res.json("DELETE SUCCESS");
      })
      .catch((err) => {
        res.json(err);
      });
  });
var updateRequest = (req, res) => {
  var { id, date, numberCustomer, status, floor } = req.body;

  usersModel.findById({ _id: id }).then((data) => {
    if (data.role > 1) {
      requestModel
        .findByIdAndUpdate(
          { _id: idRequest },
          {
            date: date,
            numberCustomer: numberCustomer,
            status: status,
            floor: floor,
          },
          new true()
        )
        .then((data) => {
          res.json("UPDATE SUCCESS");
        })
        .catch((err) => {
          res.status(500).json("UPDATE FAILS");
        });
    } else {
      res.jsoN("NOT ENOUGT PERMISSION ");
    }
  });
};
module.exports = {
  createRequest,
  deleteRequest,
  changeDateRequestAndUpdate,
  updateRequest,
  getRequest,
  getByDate,
};
