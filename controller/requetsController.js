const express = require("express");
const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));

const requestModel = require("../models/requests");
const { STATUS, REQUEST, SESSION } = require("../CONST");

const { request } = require("chai");

var getRequestTest = (req, res, next) => {
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
var getRequest = (req, res, next) => {};
var findRequest = async (req, res, next) => {
  const { date, session, floor, dateStart, dateEnd } = req.body;
  //////// check tinh hop le
  const updateSchema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD"),
    dateStart: Joi.date().format("YYYY-MM-DD").required(),
    dateEnd: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING),
    floor: Joi.number().valid(1, 2, 3, 4, 5),
    _id: Joi.string(),
    status: Joi.string().valid(REQUEST.OFF, REQUEST.ON, REQUEST.DOING),
  });
  try {
    const { error, value } = updateSchema.validate(req.body, {
      allowUnknown: false,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  } catch (err) {
    var error = new Error(err);
    error.statusCode = 400;
    throw error;
  }
  ////////

  const dieuKienLoc = req.body;
  const queryConditions = {};

  Object.keys(dieuKienLoc).forEach((key) => {
    queryConditions[key] = dieuKienLoc[key];
  });
  if (dieuKienLoc.dateStart && dieuKienLoc.dateEnd) {
    if (dieuKienLoc.dateStart > dieuKienLoc.dateEnd) {
      return res.json({ message: "date start must before date end " });
    }
    let dateStart = new Date(dieuKienLoc.dateStart);
    let dateEnd = new Date(dieuKienLoc.dateEnd);

    queryConditions.date = {
      $gte: dateStart.toISOString(),
      $lte: dateEnd.toISOString(),
    };
    delete queryConditions.dateStart;
    delete queryConditions.dateEnd;
  }

  // if (dieuKienLoc.dateStart) {
  //   let dateStart = new Date(dieuKienLoc.dateStart);
  //   queryConditions.date = {
  //     $gte: dateStart.toISOString(),
  //   };
  //   delete queryConditions.dateStart;
  // }
  // if (dieuKienLoc.dateEnd) {
  //   let dateEnd = new Date(dieuKienLoc.dateEnd);
  //   queryConditions.date = { $lte: dateEnd.toISOString() };
  //   delete queryConditions.dateEnd;
  // }

  console.log(queryConditions);

  requestModel
    .find(queryConditions) //=> .find({session:0, date:'abcyxz'})
    .then((data) => {
      if (data.length === 0) {
        return res.json({
          message: "Don't have request this time satisfy condition.",
        });
      }
      res.json({ data: data });
    })
    .catch((err) => {
      var error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
};

var createRequest = (req, res, next) => {
  var { date, numberCustomer, status, floor, session } = req.body;
  date = date.split("T")[0];
  console.log(date);

  ///////////

  const createSchema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    numberCustomer: Joi.number().required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
  });
  try {
    const { error, value } = createSchema.validate(req.body, {
      allowUnknown: false,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  } catch (err) {
    var error = new Error(err);
    error.statusCode = 400;
    throw error;
  }
  /////////
  requestModel
    .findOne({ date: date, floor: floor, session: session })
    .then((data) => {
      if (data) {
        res.json({ message: "DUPLICATED INFO", data: data });
      } else {
        requestModel
          .create({
            date: date,
            numberCustomer: numberCustomer,
            status: REQUEST.ON, //mới tạo sẽ là onl, đang hoạt động là doing, hoạt động xong là off
            floor: floor,
            session: session,
            deleted: 0,
          })
          .then((data) => {
            res.json({ message: "CREATE SUCCESS", data: data });
          })
          .catch((err) => {
            var error = new Error("ERR IS: " + err);
            error.statusCode = 404;
            throw error;
          });
      }
    })
    .catch((err) => {
      var error = new Error("ERR IS: " + err);
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

var updateRequest = (req, res, next) => {
  let { date, session, floor, _id } = req.body;

  ////////
  const updateSchema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(SESSION.MORNING, SESSION.EVENING).required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    _id: Joi.string().required(),
  });
  try {
    const { error, value } = updateSchema.validate(req.body, {
      allowUnknown: false,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  } catch (err) {
    var error = new Error(err);
    error.statusCode = 400;
    throw error;
  }
  ////////
  let now = new Date();
  date = new Date(date);
  if (date < now) {
    return res.json({
      message: "The chosen date must be greater than the current date. ",
    });
  }
  requestModel
    .findById({ _id })
    .then((data) => {
      if (!data) {
        return res.json({ message: "Pls re-check a request. " });
      }
      console.log("date:::::::::" + date.toISOString());
      requestModel
        .findOne({ date: date, floor: floor, session: session })
        .then((data) => {
          console.log("dataaaaaaa:" + data);
          if (!data) {
            requestModel
              .findByIdAndUpdate(_id, {
                date: date,
                floor: floor,
                session: session,
              })
              .then((data) => {
                res.json({ message: "this request update success" });
              })
              .catch((err) => {
                var error = new Error(err);
                error.statusCode = 400;
                throw error;
              });
          }
          res.json({
            message: "this request is busy, pls choose another time",
          });
        })
        .catch((err) => {
          var error = new Error(err);
          error.statusCode = 400;
          throw error;
        });
    })
    .catch((err) => {
      var error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
};
var cancelRequest = (req, res, next) => {
  var { date, session, floor, status } = req.body;

  //////////
  const updateSchema = Joi.object({
    date: Joi.date().format("YYYY-MM-DD").required(),
    session: Joi.number().valid(0, 1).required(),
    // status: Joi.number().required(),
    floor: Joi.number().valid(1, 2, 3, 4, 5).required(),
    status: Joi.number().valid(0, 1, 2),
  });
  try {
    const { error, value } = updateSchema.validate(req.body, {
      allowUnknown: false,
    });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  } catch (err) {
    var error = new Error(err);
    error.statusCode = 400;
    throw error;
  }

  //////////
  requestModel
    .findOne({ date: date, session: session, floor: floor })
    .then((data) => {
      if (!data) {
        res.json({ message: "PLS CHECK ORDER NEED CANCEL" });
      }
      if (data.status != REQUEST.OFF) {
        requestModel
          .findOneAndUpdate(
            { date: date, session: session, floor: floor },
            { status: REQUEST.OFF }
          )
          .then((data) => {
            console.log(data);
            if (!data) {
              res.json({ message: "pls recheck input " });
            }
            res.json({ message: "cancel success", data: data });
          })
          .catch((err) => {});
      } else {
        res.json({ mesage: "this order already cancel", data: data });
      }
    })
    .catch((err) => {});
};
module.exports = {
  createRequest,
  deleteRequest,
  updateRequest,
  getRequest,
  getRequestTest,
  findRequest,
  cancelRequest,
};
