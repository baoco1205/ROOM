// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const userModel = require("../models/users");
// const bcrypt = require("bcrypt");
// const { KEY_TOKEN } = require("../CONST");

// var checkLogin = function (req, res, next) {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.json("WRONG PASSWORD OR USERNAME");
//     }
//     req.logIn(user, function (err) {
//       if (err) {
//         return next(err);
//       }

//       next();
//     });
//   })(req, res, next);
// };

// passport.use(
//   new LocalStrategy(async function (username, password, done) {
//     const user = await userModel.findOne({ username: username });
//     if (!user) {
//       return done(null, false);
//     }
//     if (await verifyPassword(username, password)) {
//       console.log("PASS LOGIN");

//       return done(null, user);
//     } else {
//       console.log("Not pass");
//       const result = await verifyPassword(username, password);
//       console.log("verifyPassword(username, password)", result);
//       return done(null, false);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   // console.log("TEST SE:::" + user.username);
//   done(null, user);
// });
// passport.deserializeUser((user, done) => {
//   var usernamelogout = user.data.username;
//   console.log(usernamelogout);
//   if (user.username === usernamelogout) {
//     return done(null, { username, password });
//   }
//   done(null, false);
// });
// var verifyPassword = async function (username, password) {
//   try {
//     console.log(username, password);
//     let data = await userModel.findOne({ username: username });
//     if (!data || data.length == 0)
//       // xử lý trường hợp data không tồn tại
//       return false;
//     let hashPassword = data._doc.password;
//     // console.log(hashPassword, password);
//     var isMatch = await bcrypt.compare(password, hashPassword);
//     if (!isMatch) return false;
//     return true;
//   } catch (err) {
//     // xử lý lỗi
//     console.error(err);
//     return false;
//   }
// };
// module.exports = { checkLogin };

////////////////////////////////////////////////////
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// var JwtStrategy = require("passport-jwt").Strategy;
// var ExtractJwt = require("passport-jwt").ExtractJwt;
// const userModel = require("../models/users");
// const bcrypt = require("bcrypt");
// const { KEY_TOKEN } = require("../CONST");

////////////
// var passportJWT = require("passport-jwt");
// var jwt = require("jsonwebtoken");
///////////////

// var checkLogin = function (req, res, next) {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.json("WRONG PASSWORD OR USERNAME");
//     }
//     var hexString = user._id.toString();
//     var token = jwt.sign(hexString, KEY_TOKEN.keyToken);
//     const { password, ...other } = user._doc;
//     let login = { ...other, token };
//     req.user = login;
//     console.log("PASS LOGIN");
//     // req.logIn(login, function (err) {
//     //   if (err) {
//     //     return next(err);
//     //   }

//     next();
//     // });
//   })(req, res, next);
// };

// passport.use(
//   new LocalStrategy(async function (username, password, done) {
//     userModel
//       .findOne({ username: username })
//       .then(async (data) => {
//         if (!data) {
//           return false;
//         }

//         const match = await bcrypt.compare(password, data.password);
//         if (!match) {
//           return done(null, false);
//         }

//         var hexString = data._id.toString();
//         var role = data.role;
//         var token = jwt.sign({ id: hexString, role: role }, KEY_TOKEN.keyToken);

//         return done(null, data);
//       })
//       .catch((err) => {});
//   })
// );
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const { KEY_TOKEN } = require("../CONST");
const passport = require("passport");
const userModel = require("../models/users");
const cookieExtractor = function (req) {
  var token = ExtractJwt.fromAuthHeaderAsBearerToken();
  token =
    token(req) ||
    req.cookies["jwt"] ||
    req.headers["authorization"] ||
    req.cookies.token ||
    req.body.token ||
    req.query.token;
  return token;
};

// opts.issuer = "accounts.examplesoft.com";
// opts.audience = "yoursite.net";

// opts.jwtFromRequest = cookieExtractor;
var checkAuth = function (req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(403).json("err");
    }
    if (!user) {
      console.log("testttttttttt1");
      return res.json("U NEED LOGIN TO GO !");
    }
    if (user) {
      console.log("Pass check auth");
      req.user = user;
      next();
    }
  })(req, res, next);
};

// module.exports = (passport) => {
let opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = KEY_TOKEN.keyToken;
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      console.log("jwt_payload", jwt_payload);
      console.log("XXXXXXXXXXXX");
      const login = await userModel.findOne({ id: jwt_payload.sub });

      if (login) return done(null, login);
    } catch (error) {}
  })
);
// };
// };

module.exports = { checkAuth };
