var brypt = require("bcrypt");
const Joi = require("@hapi/joi");

const checkAuth = require("../middleware/checkPassport");
//CONST
const { ROLE, CHECK_SCHEMA } = require("../CONST.js");
const usersModel = require("../models/users");
const without = require("../controller/without");
//middware
// routerUsers.use(checkAuth.checkAuth);
//
var getMyInfo = (req, res, next) => {
  var username = req.user.username;
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
  let { role } = req.user;
  if (role <= 1) {
    return res.json({
      succcess: false,
      message: "Your role not enought to do this!",
    });
  }
  if (role === ROLE.MANAGER) {
    usersModel
      .find({ deleted: 0, role: { $lt: ROLE.MANAGER } })
      .then((data) => {
        return res.json({ message: true, data: data });
      })
      .catch((err) => {
        let error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  }
  if (role === ROLE.ADMIN) {
    usersModel
      .find({ deleted: 0, role: { $lt: ROLE.ADMIN } })
      .then((data) => {
        return res.json({ message: true, data: data });
      })
      .catch((err) => {
        let error = new Error(err);
        error.statusCode = 400;
        throw error;
      });
  }
};
var findUser = (req, res, next) => {
  let { id, username } = req.body;
  usersModel
    .findOne({ username: username })
    .then((user) => {
      res.json({ user: user });
    })
    .catch((err) => {
      let error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
};
var createUser = async (req, res) => {
  var { username, password, name, address, phone, role, note } = req.body;
  CHECK_SCHEMA.CREATE_USER_SCHEMA.validateAsync(req.body, {
    allowUnknown: false,
  })
    .then((payload) => {
      usersModel.findOne({ username: username }).then(async (data) => {
        if (data) {
          res.json("User name has been used");
        } else {
          let salt = await brypt.genSalt(10);
          let hashPassword = await brypt.hash(password, salt);
          password = hashPassword;
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
            .then((data) => {
              const user = without.withoutPassword(data);
              console.log(data);
              res.json({ message: "Create success", data: user });
            });
        }
      });
    })
    .catch((err) => {
      var error = new Error("CREATE FAILS!!!: " + err);
      error.statusCode = 500;
      throw error;
    });
};
//UPDATE INFO
var updateUser = async (req, res) => {
  var { role } = req.user;
  let { password, name, address, phone, note, id } = req.body;
  CHECK_SCHEMA.UPDATE_USER_SCHEMA.validateAsync(req.body, {
    allowUnknown: false,
  })
    .then(async (payload) => {
      var salt = await brypt.genSalt(10);
      var hashPassword = await brypt.hash(password, salt);
      password = hashPassword;
      if (role >= ROLE.ADMIN) {
        usersModel
          .findByIdAndUpdate(
            {
              _id: id,
            },
            {
              password: password,
              name: name,
              address: address,
              phone: phone,
              role: role,
              note: note,
            },
            { new: true }
          )
          .then((data) => {
            if (data) {
              console.log(data);
              res.json({
                message: "update success",
                data: without.withoutPassword(data),
              });
            } else if ((data = null)) {
              console.log(data);
              res.json("update FAILS");
            }
          });
      } else if (role >= MANAGER_ROLE) {
        usersModel.findByIdAndUpdate({ _id: id }).then((data) => {});
      } else if (role <= 1) {
        res.json("YOUR ROLE NOT ENOUGH");
      }
    })
    .catch((err) => {
      var error = new Error("CREATE FAILS!!!: " + err);
      error.statusCode = 500;
      throw error;
    });
};

// );
var updateMySelf = async (req, res) => {
  let id = req.user.id;

  var { password, note, name, address, phone } = req.body;
  CHECK_SCHEMA.UPDATE_MYSELF_SCHEMA(req.body, { allowUnknown: false })
    .then(async (data) => {
      let salt = await brypt.genSalt(10);
      let hashPassword = await brypt.hash(password, salt);
      password = hashPassword;
      usersModel
        .findByIdAndUpdate(
          { _id: id },
          {
            $set: {
              password: password,
              note: note,
              name: name,
              address: address,
              phone: phone,
            },
          }
        )
        .then((data) => {
          if (data) {
            res.json({ message: "Update success", data: data });
          }
        });
    })
    .catch((err) => {
      let error = new Error(err);
      error.statusCode = 400;
      throw error;
    });
};
var deleteUser = (req, res) => {
  var { username } = req.body;
  usersModel
    .deleteOne({ username: username })
    .then((data) => {
      console.log(data);
      if (data.deletedCount === 0) {
        return res.json({ message: "DON'T HAVE ID TO DELETE" });
      }
      return res.json({ message: "DELETE SUCCESS" });
    })
    .catch((err) => {
      var error = new Error("DELETE USER FAILS :" + err);
      error.statusCode = 500;
      throw error;
    });
};
var createCustomer = (req, res) => (req, res) => {
  console.log(req.body);
  var { usernameNew, passwordNew, name, address, phone, note } = req.body;
  usersModel
    .findOne({ username: usernameNew })
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

var sortByName = (req, res, next) => {
  var sortSchema;
  usersModel
    .find({})
    .then((data) => {
      let name = data.name;
      console.log(data);
      let fullName = name.split(" ");
      console.log(name, fullName);
      let lastName = fullName[fullName.length - 1];
      return lastName;
    })
    .sort({ name: 1 })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 401;
      throw error;
    });
};
let softDelete = (req, res, next) => {
  let { id } = req.body;
  usersModel
    .find({ _id: id, deleted: 0 })
    .then((data) => {
      if (data.length === 0) {
        return res.json({ message: "User already deleted" });
      }
      usersModel.findByIdAndUpdate(id, { deleted: 1 }).then((data) => {
        res.json({ message: "User delete success" });
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.statusCode = 401;
      throw error;
    });
};
module.exports = {
  createUser,
  createCustomer,
  getUser,
  deleteUser,
  softDelete,
  updateUser,
  getMyInfo,
  updateMySelf,
  sortByName,
};
