const usersModel = require("../models/users");

var checkRole = async function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  // console.log("CHECK::::" + username, password);
  return await usersModel
    .findOne({ username: username, password: password })
    .then((data) => {
      var newid = data._id;
      //newid tra ve 1 object: new ObjectId("6531f755ca71de5b06f279fc")
      var id = newid.toString();
      // su dung toString de ra ket qua : 6531f755ca71de5b06f279fc
      req.body.id = id;
      var role = parseInt(data.role);
      // console.log("role:::::" + role);
      return role;
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

var checkRoleUser = async function (req, res, next) {
  if ((await checkRole(req, res, next)) >= 1) {
    next();
  } else {
    res.json("LOGIN FAILS");
  }
};

var checkRoleManager = async function (req, res, next) {
  if ((await checkRole(req, res, next)) >= 2) {
    next();
  } else {
    res.json("LOGIN FAILS");
  }
};
var checkRoleAdmin = async function (req, res, next) {
  var role = await checkRole(req, res, next);
  // console.log("TESTTT" + role);
  if (role >= 3) {
    // console.log("xxxxx");
    next();
  } else {
    res.json("LOGIN FAILS");
    // res.redirect("/home");
  }
};
module.exports = { checkRoleUser, checkRoleAdmin, checkRoleManager };
