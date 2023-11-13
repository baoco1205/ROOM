var userModel = require("../models/users");
var jwt = require("jsonwebtoken");

const KEY_TOKEN = "matkhautokenoday";

var createToken =  function (req, res, next) {
  var id =  req.body.id;
  // console.log(id);
  userModel
    .findById({ _id: id })
    .then((data) => {
      var token = jwt.sign({ id: id }, `${KEY_TOKEN}`);
      req.body.token = token;
      console.log(token);
      next();
    })
    .catch((err) => {
      res.json("HAS ERROR: " + err);
    });
};
module.exports = { createToken };
