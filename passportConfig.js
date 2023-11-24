const passport = require("passport");

module.exports = function (app) {
  require("./middleware/checkPassport.js")(passport);
  app.use(passport.initialize());
};
