const express = require("express");
var routerUsers = express.Router();
var checkRole = require("./checkRole");
//CONST
const ADMIN_ROLE = 3;
const MANAGER_ROLE = 2;
const USER_ROLE = 1;

const usersModel = require("../models/users");
var getMyInfo = (req, res, next) => {
  var username = req.body.username;
  usersModel
    .findOne({ username: username })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      var error = new Error("NOT TRUE THIS PART");
      error.statusCode = 400;
      throw error;
    });
};
var getUser = (req, res) => {
  var role = req.body.role;
  console.log(role);
  if (role === MANAGER_ROLE) {
    var username = req.body.username;
    usersModel
      .find({ role: { $lt: MANAGER_ROLE } })
      .then((data) => {
        if (data === null) {
          const error = new Error("YOUR ROLE NOT ENOUGH");
          error.statusCode = 500;
          throw error;
        } else {
          res.json(data);
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.statusCode = 401;
        throw error;
        // res.json(err);
      });
  }
  if (role === ADMIN_ROLE) {
    usersModel
      .find({ role: { $lt: MANAGER_ROLE } })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
  if (role === ADMIN_ROLE) {
    usersModel
      .find({ role: { $lt: ADMIN_ROLE } })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
};

var createUser = (req, res) => {
  console.log(req.body);
  var { username, userNameNew, passwordNew, name, address, phone, role, note } =
    req.body;
  usersModel
    .findOne({ username: userNameNew })
    .then((data) => {
      if (data) {
        res.json("User name has been used");
      } else {
        usersModel
          .create({
            username: userNameNew,
            password: passwordNew,
            name: name,
            address: address,
            phone: phone,
            role: role,
            note: note,
          })
          .then((data) => res.json("Create user complete!!"))
          .catch((err) => {
            var error = new Error();
            error.statusCode = 500;
            throw error;
          });
      }
    })
    .catch((err) => {
      res.json("HAVE ERRO: " + err);
    });
};
//UPDATE INFO
var updateUser =
  // (checkRole.checkRoleManager,

  (req, res) => {
    var {
      username,
      userNameNew,
      passwordNew,
      name,
      address,
      phone,
      role,
      roneNew,
      note,
    } = req.body;
    if (role === 3) {
      usersModel
        .updateOne(
          {
            username: username,
            role: { $lt: 3 },
          },
          {
            username: userNameNew,
            password: passwordNew,
            name: name,
            address: address,
            phone: phone,
            role: role,
            note: note,
          }
        )
        .then((data) => {
          console.log("data", data);
          if (data.acknowledged === true) {
            console.log(data);
            res.json("update success");
          } else {
            console.log(data);
            res.json("update FAILS");
          }
        })
        .catch((err) => {
          var error = new Error("UPDATE FAILS");
          err.statusCode = 401;
          throw error;
        });
    } else if (role === 2) {
      usersModel
        .updateOne(
          {
            username: username,
            role: { $lt: 2 },
          },
          {
            username: userNameNew,
            password: passwordNew,
            name: name,
            address: address,
            phone: phone,
            role: role,
            note: note,
          }
        )
        .then((data) => {
          console.log("data", data);
          if (data.acknowledged === true) {
            console.log(data);
            res.json("update success");
          } else {
            console.log(data);
            res.json("update FAILS");
          }
        })
        .catch((err) => {
          var error = new Error("UPDATE FAILS");
          err.statusCode = 401;
          throw error;
        });
    }
  };
// );
var deleteUser = (req, res) => {
  var username = req.body.username;
  usersModel
    .deleteOne({ username: username })
    .then(() => {
      res.json("DELETE SUCCESS");
    })
    .catch((err) => {
      var error = new Error("DELETE USER FAILS");
      error.statusCode = 500;
      throw error;
    });
};
var createCustomer = (req, res) => {
  checkRole.checkRoleManager,
    (req, res) => {
      console.log(req.body);
      var { username, password, name, address, phone, role, note } = req.body;
      usersModel
        .findOne({ username: username })
        .then((data) => {
          if (data) {
            res.json("User name has been used");
          } else {
            usersModel
              .create({
                username: username,
                password: password,
                name: name,
                address: address,
                phone: phone,
                role: role,
                note: note,
              })
              .then(res.json("Create user complete!!"))
              .catch((err) =>
                res.status(500).json("Create fails, have error: " + err)
              );
          }
        })
        .catch((err) => {
          res.json("HAVE ERRO: " + err);
        });
    };
};
module.exports = {
  createUser,
  createCustomer,
  getUser,
  deleteUser,
  updateUser,
  getMyInfo,
};
