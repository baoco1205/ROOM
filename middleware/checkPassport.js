const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const { KEY_TOKEN } = require("../CONST");

var checkLogin = function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }

    // if (err) {
    //   var error = new Error(err);
    //   err.statusCode = 400;
    //   throw error;
    // }

    if (!user) {
      return res.json("WRONG PASSWORD OR USERNAME");
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }

      next();
    });
  })(req, res, next);
};

passport.use(
  new LocalStrategy(async function (username, password, done) {
    const user = await userModel.findOne({ username: username });
    if (!user) {
      return done(null, false);
    }
    if (await verifyPassword(username, password)) {
      console.log("PASS LOGIN");

      return done(null, user);
    } else {
      console.log("Not pass");
      const result = await verifyPassword(username, password);
      console.log("verifyPassword(username, password)", result);
      return done(null, false);
    }
  })
);

passport.serializeUser((user, done) => {
  // console.log("TEST SE:::" + user.username);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  var usernamelogout = user.data.username;
  if (user.username === usernamelogout) {
    return done(null, { username, password });
  }
  done(null, false);
});
var verifyPassword = async function (username, password) {
  try {
    console.log(username, password);
    let data = await userModel.findOne({ username: username });
    if (!data || data.length == 0)
      // xử lý trường hợp data không tồn tại
      return false;
    let hashPassword = data._doc.password;
    // console.log(hashPassword, password);
    var isMatch = await bcrypt.compare(password, hashPassword);
    if (!isMatch) return false;
    return true;
  } catch (err) {
    // xử lý lỗi
    console.error(err);
    return false;
  }
};
module.exports = { checkLogin };
