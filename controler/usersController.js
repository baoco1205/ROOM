const express = require("express");
var routerUsers = express.Router();
var checkRole = require("../controler/checkRole1");
//CONST
const ADMIN_ROLE = 3;
const MANAGER_ROLE = 2;
const USER_ROLE = 1;

const usersModel = require("../models/users");

var getUser = (req, res) => {
  var role = req.body.role;
  if (role === USER_ROLE) {
    var username = req.body.username;
    usersModel
      .findOne({ username: username })
      .then((data) => {
        if (data === null) {
          res.json("WRONG USERNAME, PLS RE-CHECK");
        } else {
          res.json(data);
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }
  if (role === MANAGER_ROLE) {
    usersModel
      .find({ role: { $lt: MANAGER_ROLE } })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  } else {
    usersModel
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
};

var createUser =
  (checkRole.checkRoleManager,
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
  });
//UPDATE INFO
var updateUser =
  (checkRole.checkRoleManager,
  (req, res) => {
    var { username, password, name, address, phone, role, note } = req.body;
    usersModel
      .updateOne(
        {
          username: username,
        },
        {
          password: password,
          name: name,
          address: address,
          phone: phone,
          role: role,
          note: note,
        }
      )
      .then((data) => {
        res.json("update success");
      })
      .catch((err) => {
        res.status(500).json("have err: " + err);
      });
  });
var deleteUser =
  (checkRole.checkRoleManager,
  (req, res) => {
    var username = req.body.username;
    usersModel
      .deleteOne({ username: username })
      .then(() => {
        res.json("DELETE SUCCESS");
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });
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
};
