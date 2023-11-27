var jwt = require("jsonwebtoken");
const { KEY_TOKEN } = require("../CONST");
const usersModel = require("../models/users");
const bcrypt = require("bcrypt");

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
    .findOne({ username: username })
    .then((data) => {
      if (!data) {
        res.json("WRONG PASSWORD OR USERNAME");
      }
      bcrypt.compare(password, data.password, function (err, result) {
        if (err) {
          res.json("WRONG PASSWORD OR USERNAME");
        }
        if (!result) {
          res.json("WRONG PASSWORD OR USERNAME");
        }
        var id = data._id.toString();
        let token = jwt.sign({ id }, KEY_TOKEN.keyToken, {
          expiresIn: "12h",
        });
        // console.log(token);
        const { password, ...other } = data._doc;
        req.user = { data: { ...other }, token: token };

        next();
      });
    })
    .catch((err) => {
      var error = new Error("HAS ERROR AT LOGIN: " + err);
      error.statusCode = 500;
      throw error;
    });
};

module.exports = { checkLogin };
