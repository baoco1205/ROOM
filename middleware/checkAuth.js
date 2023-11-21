var jwt = require("jsonwebtoken");
var userModel = require("../models/users");
var { KEY_TOKEN } = require("../CONST");
var checkAuth = (req, res, next) => {
  let token = req.user.token;
  console.log(token);
  var decoded = jwt.verify(token, KEY_TOKEN);
  console.log(decoded);
  try {
    if (!token) {
      return res.status(401).json("Missing Authorization token");
    }
    jwt.verify(token, KEY_TOKEN, async (err, decoded) => {
      if (err) {
        return res.status(403).json("TOKEN HAS PROBLEM");
      } else {
        let id = decoded._id;
        let username = decoded.username;
        let role = decoded.role;
        await userModel
          .findOne({ _id: id })
          .then((data) => {
            req.user.role = role;
            req.user.id = id;
            console.log("PASS CHECK AUTH");
            next();
          })
          .catch((err) => {
            var error = new Error(err);
            error.statusCode = 404;
            throw error;
          });
      }
    });
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};
module.exports = { checkAuth };
