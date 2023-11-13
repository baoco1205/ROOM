const express = require("express");
var routerUsers = express.Router();
var checkRole = require("./checkRole");
//CONST
const ADMIN_ROLE = 3;
const MANAGER_ROLE = 2;
const USER_ROLE = 1;
const CUSTOMER_ROLE = 0;

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
var getUser = async (req, res) => {
  var roleString = await req.user.data.role; // ra role kieu string, khong dung duoc ===
  var role = parseInt(roleString);
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
  if (role === USER_ROLE) {
    res.json({ message: "NOT ENOUGH ROLE" });
  }
  if (role == ADMIN_ROLE) {
    console.log("TESTTTT" + role);
    usersModel
      .find({ role: { $lt: ADMIN_ROLE } })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  }
};

var createUser = (req, res) => {
  console.log(req.body);
  var { userNameNew, passwordNew, name, address, phone, role, note } = req.body;
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
            var error = new Error("CREATE FAILS!!!: " + err);
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
var updateUser = (req, res) => {
  var { role, username, _id } = req.user.data;
  var id = _id.toHexString();

  var { passwordNew, nameNew, addressNew, phoneNew, noteNew, roleNew } =
    req.body;
  if (parseInt(role) === ADMIN_ROLE) {
    usersModel
      .updateOne(
        {
          _id: id,
        },
        {
          password: passwordNew,
          name: nameNew,
          address: addressNew,
          phone: phoneNew,
          role: roleNew,
          note: noteNew,
        }
      )
      .then((data) => {
        if (data.acknowledged === true) {
          console.log("data");
          res.json("update success");
        } else if ((data = null)) {
          console.log(data);
          res.json("update FAILS");
        }
      })
      .catch((err) => {
        var error = new Error("UPDATE FAILS: " + err);
        error.statusCode = 401;
        throw error;
      });
  } else if (parseInt(role) === MANAGER_ROLE) {
    usersModel
      .updateOne(
        {
          username: username,
          role: { $lt: MANAGER_ROLE },
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
  } else if (req.body.role <= 1) {
    res.json("YOUR ROLE NOT ENOUGH");
  }
};
// );
var updateMySelf = (req, res) => {
  var { id, passwordNew, noteNew, nameNew, addressNew, phoneNew } = req.body;
  usersModel
    .findById(
      { _id: id },
      {
        $set: {
          password: passwordNew,
          note: noteNew,
          name: nameNew,
          address: addressNew,
          phone: phoneNew,
        },
      }
    )
    .then()
    .catch();
};
var deleteUser = (req, res) => {
  var username = req.body.usernameDelete;
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
var createCustomer = (req, res) => (req, res) => {
  console.log(req.body);
  var { usernameNew, passwordNew, name, address, phone, note } = req.body;
  usersModel
    .findOne({ username: username })
    .then((data) => {
      if (data) {
        res.json("User name has been used");
      } else {
        usersModel
          .create({
            username: usernameNew,
            password: passwordNew,
            name: name,
            address: address,
            phone: phone,
            role: 0,
            note: note,
          })
          .then(res.json("Create user complete!!"))
          .catch((err) =>
            res.status(500).json("Create fails, have error: " + err)
          );
      }
    })
    .catch((err) => {
      var error = new Error({ message: "CREATE CUSTOMER FAILS", Error: err });
      error.statusCode = 500;
      throw error;
    });
};
module.exports = {
  createUser,
  createCustomer,
  getUser,
  deleteUser,
  updateUser,
  getMyInfo,
  updateMySelf,
};
