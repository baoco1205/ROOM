var jwt = require("jsonwebtoken");
const keyToken = "matkhautokenoday";
const usersModel = require("../models/users");
var checkLogin = function (req, res, next) {
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

module.exports = { checkLogin };
