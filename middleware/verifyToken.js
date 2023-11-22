var jwt = require("jsonwebtoken");
var { KEY_TOKEN } = require("../CONST");
var userModel = require("../models/users");

var authentication = async (req, res, next) => {
  var tokenHeaders = req.headers.authentication;
  if (tokenHeaders) {
    var token = tokenHeaders.split(" ")[1];
    console.log(token);
    jwt.verify(token, KEY_TOKEN.keyToken, (err, _id) => {
      if (err) {
        res.status(403).json("TOKEN NOT VALID");
      }
      userModel
        .findById({ _id })
        .then((data) => {
          console.log("pass auth");
          req.user = data;
          next();
        })
        .catch((err) => {
          res.json("pls re-login");
        });
    });
  } else {
    res.status(403).json("U MUST LOGIN");
  }
};
module.exports = { authentication };
