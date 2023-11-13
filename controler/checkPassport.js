const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");
const { KEY_TOKEN } = require("../CONST");

var checkLogin = passport.authenticate("local", {});
passport.use(
  new LocalStrategy((username, password, done) => {
    console.log(username, password);
    userModel
      .findOne({ username: username, password: password })
      .then((data) => {
        if (data) {
          console.log(data);
          console.log("PASS LOGIN");
          return done(null, { data });
        } else {
          return done(null, false, { message: "WRONG PASSWORD OR USERNAME" });
        }
      })
      .catch((err) => {
        const error = new Error("LOI O DAYY: " + err);
        error.statusCode = 404;
        throw error;
      });
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

module.exports = { checkLogin };
