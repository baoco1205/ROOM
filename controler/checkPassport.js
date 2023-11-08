const passport = require("passport");
const LocalStragery = require("passport-local").Strategy;
const userModel = require("../models/users");

var checkLogin = passport.authenticate("local", {});
passport.use(
  new LocalStragery((username, password, done) => {
    // console.log(username, password);
    userModel
      .findOne({ username: username, password: password })
      .then((data) => {
        if (data) {
          // console.log(data);

          return done(null, { data });
        } else {
          return done(null, false);
        }
      })
      .catch((err) => {
        const error = new Error();
        error.statusCode = 500;
        throw error;
      });
  })
);

passport.serializeUser((user, done) => {
  // console.log(user);
  done(null, user);
});
passport.deserializeUser((user, done) => {
  if (username === user.username) {
    return done(null, { username, password });
  }
  done(null, false);
});

module.exports = { checkLogin };
