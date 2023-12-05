var brypt = require("bcrypt");
const Joi = require("@hapi/joi");

const checkAuth = require("../middleware/checkPassport");
//CONST
const { ROLE, CHECK_SCHEMA } = require("../CONST.js");
const usersModel = require("../models/users");
const without = require("../controller/without");
const response = require("./response.js");
//middware
// routerUsers.use(checkAuth.checkAuth);
//
var getMyInfo = (req, res, next) => {
  var username = req.user.username;
  usersModel
    .findOne({ username: username })
    .then((data) => {
      response.response(res, data, "Get info success");
    })
    .catch((err) => {
      response.responseError(res, err, 400);
    });
};
var getUser = async (req, res) => {
  let { role } = req.user;
  if (role <= 1) {
    return response.response(
      res,
      undefined,
      "Your role not enough to do this!"
    );
  }
  if (role === ROLE.MANAGER) {
    usersModel
      .find({ deleted: 0, role: { $lt: ROLE.MANAGER } })
      .then((data) => {
        response.response(res, data);
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
  if (role === ROLE.ADMIN) {
    usersModel
      .find({ deleted: 0, role: { $lt: ROLE.ADMIN } })
      .then((data) => {
        response.response(res, data);
      })
      .catch((err) => {
        response.responseError(res, err, 404);
      });
  }
};
var findUser = (req, res, next) => {
  let { id, username } = req.body;
  usersModel
    .findOne({ username: username })
    .then((user) => {
      response.response(res, user);
    })
    .catch((err) => {
      response.responseError(res, err, 404);
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
          response.response(res, undefined, "User name has been used");
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
              response.response(res, user, "CREATE SUCCESS");
              // res.json({ message: "Create success", data: user });
            });
        }
      });
    })
    .catch((err) => {
      response.responseError(res, err, 500);
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
      if (role === ROLE.ADMIN) {
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
              // console.log(data);
              data = without.withoutPassword(data);
              let message = "CREATE SUCCESS";
              response.response(res, data, message);
            } else if ((data = null)) {
              console.log(data);
              response.response(
                res,
                data,
                "update fails, pls recheck id need update"
              );
            }
          });
      } else if (role === MANAGER_ROLE) {
        usersModel.findByIdAndUpdate({ _id: id }).then((data) => {
          if (!data) {
            return response.response(
              res,
              undefined,
              "Don't have id you want find"
            );
          }
          if (data.role >= MANAGER_ROLE) {
            response.response(
              res,
              undefined,
              "Can't update account equal your role"
            );
          }
        });
      } else if (role <= 1) {
        response.response(res, undefined, "YOUR ROLE NOT ENOUGH");
      }
    })
    .catch((err) => {
      response.responseError(res, err, 500);
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
            response.response(res, data, "Update success");
          }
        });
    })
    .catch((err) => {
      response.responseError(res, err, 500);
    });
};
var deleteUser = (req, res) => {
  var { username } = req.body;
  usersModel
    .deleteOne({ username: username })
    .then((data) => {
      console.log(data);
      if (data.deletedCount === 0) {
        response.response(res, undefined, "DON'T HAVE ID TO DELETE");
      }
      response.response(res, undefined, "DELETE SUCCESS");
    })
    .catch((err) => {
      response.responseError(res, err, 500);
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
  usersModel
    .find({})
    .then((data) => {
      let name = data.name;
      console.log(data);
      let fullName = name.split(" ");
      console.log(name, fullName);
      let lastName = fullName[fullName.length - 1];
    })

    .catch((err) => {
      response.responseError(res, err, 400);
    });
};
let softDelete = (req, res, next) => {
  let { id } = req.body;
  usersModel
    .find({ _id: id, deleted: 0 })
    .then((data) => {
      if (data.length === 0) {
        response.response(res, undefined, "User already deleted");
      }
      usersModel.findByIdAndUpdate(id, { deleted: 1 }).then((data) => {
        response.response(res, undefined, "User delete success");
      });
    })
    .catch((err) => {
      response.responseError(res, err, 500);
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

// var arr = [1, 2, 34, 4, 5];
// var bb = [...arr, 1];
// var cc = function (...params) {
//   console.log(params);
// };
