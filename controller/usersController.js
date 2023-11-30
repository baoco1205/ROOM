// const express = require("express");
// var routerUsers = express.Router();
// var checkRole = require("../middleware/checkRole");
var brypt = require("bcrypt");
const Joi = require("@hapi/joi");
// const verifyToken = require("../middleware/verifyToken");
const checkAuth = require("../middleware/checkPassport");
//CONST
const ADMIN_ROLE = 3;
const MANAGER_ROLE = 2;
const USER_ROLE = 1;
const CUSTOMER_ROLE = 0;
const usersModel = require("../models/users");
const without = require("../controller/without");
//middware
// routerUsers.use(checkAuth.checkAuth);
//
var getMyInfo = (req, res, next) => {
  var username = req.user.username;
  // console.log("usernameeeeeeeeeeeee1 " + req.user);
  // console.log("usernameeeeeeeeeeeee " + username);
  // console.log(username);
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
  var roleString = await req.user.role; // ra role kieu string, khong dung duoc ===
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
    // console.log("TESTTTT" + role);
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

var createUser = async (req, res) => {
  var { username, password, name, address, phone, role, note } = req.body;
  // !!!!!!!!!!!!!!!!!!!!!!!!! Check kiểu dữ liệu
  const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(6).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2, 3).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
  });
  try {
    const { error, value } = registerSchema.validate(req.body, {
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

  // !!!!!!!!!!!!!!!!!!!!!!

  usersModel
    .findOne({ username: username })
    .then(async (data) => {
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
          })
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
var updateUser = async (req, res) => {
  var { role, username } = req.user;
  let { password, name, address, phone, note, id } = req.body;

  /////////////////////////
  const updateSchema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
    id: Joi.string().alphanum().max(500).required(),
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
  //////////////////
  // var id = _id.toHexString();
  console.log(role);
  var salt = await brypt.genSalt(10);
  var hashPassword = await brypt.hash(password, salt);
  password = hashPassword;
  if (role >= ADMIN_ROLE) {
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
      })
      .catch((err) => {
        var error = new Error("UPDATE FAILS: " + err);
        error.statusCode = 401;
        throw error;
      });
  } else if (role >= MANAGER_ROLE) {
    usersModel
      .findByIdAndUpdate({ _id: id })
      .then((data) => {})
      .catch((err) => {
        let error = new Error(err);
        error.statusCode = 403;
        throw error;
      });
  } else if (role <= 1) {
    res.json("YOUR ROLE NOT ENOUGH");
  }
};
// );
var updateMySelf = async (req, res) => {
  let id = req.user.id;

  var { password, note, name, address, phone } = req.body;
  /////////////////

  const updateSchema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    // email: Joi.string().email().required(),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    role: Joi.number().valid(1, 2).default(1),
    name: Joi.string()
      .regex(/^[a-zA-Z\u00C0-\u017F\s]+$/)
      .required(),
    address: Joi.string().alphanum().min(3).max(100).optional(),
    note: Joi.string().alphanum().max(500).optional(),
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

  /////////////////

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
module.exports = {
  createUser,
  createCustomer,
  getUser,
  deleteUser,
  updateUser,
  getMyInfo,
  updateMySelf,
  sortByName,
};
