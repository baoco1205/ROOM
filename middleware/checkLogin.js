var jwt = require("jsonwebtoken");
const keyToken = "matkhautokenoday";
const usersModel = require("../models/users");
var checkLoginToken = function (req, res, next) {
  // var token = req.body.token;
  var cookie = req.cookies;
  console.log(cookie);
  var unlockToken = jwt.verify(cookie.token, `${keyToken}`);
  // unblock token trả về 1 đối tượng gồm _id và iat;
  usersModel
    .findById({ _id: unlockToken._id })
    .then((data) => {
      req.body.infouser = data; // chu y

      next();
    })
    .catch((err) => {
      res.redirect("/login");
    });
};
var checkLogin = function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  usersModel
    .findOne({ username: username, password: password })
    .then((data) => {
      if (data) {
        console.log(data);
        console.log("Pass Login");
        next();
      } else if (!data) {
        res.status(400).json({ Messsage: "WRONG PASSWORD OR USERNAME" });
      }
    })
    .catch((err) => {
      var error = new Error("HAS ERROR AT LOGIN");
      error.statusCode = 500;
      throw error;
    });
};

module.exports = { checkLogin, checkLoginToken };
