const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const { KEY_TOKEN } = require("../CONST");

var checkLogin = function (req, res, next) {
  // if (req.user) {
  //   return res.json("ALREADY LOGGED IN");
  // }
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
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
    // userModel
    //   .findOne({ username: username })
    //   .then((data) => {
    //     if (data && verifyPassword(username, password)) {
    //       console.log("PASS LOGIN");
    //       done(null, data);
    //     } else {
    //       return done(null, false);
    //     }
    //   })
    //   .catch((err) => {
    //     return done(err);
    //   });
    //  function (err, user) {
    //       if (err) {
    //         return done(err);
    //       }
    //       if (!user) {
    //         return done(null, user);
    //       }
    //       if (user && password === verifyPassword(password)) {
    //         return done(null, user);
    //       }
    //       return done(null, false);
    //     });
  })
);

// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     await comparePassword(username, password);
//     console.log(typeof comparePassword(username, password));
//     userModel
//       .findOne({ username: username, password: password })
//       .then((data) => {
//         if (data) {
//           console.log(data);
//           console.log("PASS LOGIN");
//           return done(null, { data });
//         } else if (!data) {
//           return done(null, false, { message: "WRONG PASSWORD OR USERNAME" });
//         }
//       })
//       .catch((err) => {
//         const error = new Error("LOI O DAYY: " + err);
//         error.statusCode = 404;
//         throw error;
//       });
//   })
// );

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
