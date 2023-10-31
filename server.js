const express = require("express");
const app = express();

//NPM
var cors = require("cors");
var jwt = require("jsonwebtoken");
const path = require("path");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const keyToken = "matkhautokenoday";
//ROUTER
var reportsRouter = require("./Router/report.js");
var usersRouter = require("./Router/users.js");
var roomsRouter = require("./Router/rooms.js");
var requestsRouter = require("./Router/requests.js");
var managerUsers = require("./Router/managerUsers.js");
var routerRequest = require("./controler/requetsController.js");
const usersModel = require("./models/users.js");
const roomsModel = require("./models/rooms.js");
const reportsModel = require("./models/reports.js");
const requestsModel = require("./models/requests.js");

//Controler
const checkRole = require("./controler/checkRole.js");
const checkLogin = require("./controler/checkLogin.js");
const checkRole1 = require("./controler/checkRole1.js");
const calendarLogin = require("./controler/calendarSaveLogin.js");
const createToken = require("./controler/tokenCreate.js");
//config cookie Parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// config body parser
var bodyParser = require("body-parser");
const { fail } = require("assert");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
// CRUD user, room, report, request.
app.use("/api/v1", usersRouter);
app.use("/api/v1", roomsRouter);
app.use("/api/v1", reportsRouter);
app.use("/api/v1", requestsRouter);
app.use("/api/v1", managerUsers);

const port = 3000;

//SESSION
const KEY_SESSION = "SESSIONKEY";
app.set("trust proxy", 1); // trust first proxy

const store = session.MemoryStore();
app.use(
  session(
    {
      saveUninitialized: false,
      secret: KEY_SESSION,
      maxAge: 1000 * 30,
    },
    store
  )
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/public", express.static(path.join(__dirname, "public")));
app.get("/home", (req, res, next) => {
  res.json("HOME PAGE");
});

// app.post("/register", (req, res, next) => {
//   res.sendFile(path.join(__dirname, "/public/html", "register.html"));
//   var { username, password, name, address, phone, role, note } = req.body;
//   usersModel
//     .findOne({ username: username })
//     .then((data) => {
//       if (data) {
//         res.json("User name has been used");
//       } else {
//         usersModel
//           .create({
//             username: username,
//             password: password,
//             name: name,
//             address: address,
//             phone: phone,
//             role: role,
//             note: note,
//           })
//           .then(res.json("Create complete!!"))
//           .catch((err) =>
//             res.status(500).json("Create fails, have erro: " + err)
//           );
//       }
//     })
//     .catch((err) => {});
// });
app.get("/login", function (req, res) {
  // res.sendFile(path.join(__dirname, "/public/html", "login.html"));
  res.json("Login");
});
app.post(
  "/login2",
  (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    usersModel
      .findOne({ username: username, password: password })
      .then((data) => {
        if (data === null) {
          res.json("Wrong password or username");
        } else {
          var _id = data._id;
          var token = jwt.sign({ _id: _id }, `${keyToken}`);
          console.log(token);
          res.cookie("token", token, { httpOnly: true });
          next();
        }
      })
      .catch((err) => {
        res.status(500).json("HAVE ERR HERE: " + err);
      });
  },
  checkLogin.checkLogin,
  checkRole.checkRoleUser,
  (req, res) => {
    res.redirect("/home");
  }
);
app.post(
  "/login",
  passport.authenticate("local", {
    // successRedirect: "/home",
    failureRedirect: "/login",
    session: true,
  }),
  checkRole1.checkRoleUser,
  createToken.createToken,
  calendarLogin.saveTimeLogin,
  (req, res, next) => {
    res.json("HOME");
  }
);

passport.use(
  new localStrategy((username, password, done) => {
    console.log(username, password);
    usersModel
      .findOne({ username: username, password: password })
      .then((data) => {
        if (data) {
          // console.log(data.username);
          // return done(null, { data: data, active: true });
          return done(null, {
            username: data.username,
            password: data.password,
            id: data.id,
            active: true,
          });
        } else {
          done(null, false);
        }
      })
      .catch((err) => {
        return done(err);
      });
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  // console.log("1");
  usersModel
    .findById({ _id: id })
    .then((data) => {
      // console.log("ID LA ::::" + id);
      done(null, data);
    })
    .catch((err) => {
      done(err);
    });
});
app.listen(port, () => {
  console.log("CONNECT AT : " + port);
});
