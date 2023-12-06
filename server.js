const express = require("express");
const app = express();
require("dotenv").config();
//NPM
var cors = require("cors");
var jwt = require("jsonwebtoken");
const path = require("path");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const session = require("express-session");
const { KEY_TOKEN } = require("./CONST.js");
//ROUTER
var routerReport = require("./Router/report.js");
var usersRouter = require("./Router/users.js");
var roomsRouter = require("./Router/rooms.js");
var requestsRouter = require("./Router/requests.js");

//Controler
const calendarLogin = require("./controller/calendarSaveLogin.js");

//config cookie Parser
var cookieParser = require("cookie-parser");
app.use(cookieParser());

// config body parser
var bodyParser = require("body-parser");
const { fail } = require("assert");
const checkLogin = require("./middleware/checkLogin.js");
const response = require("./controller/response.js");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.URL_CLIENT }));

//PASSPORT
// require("./passportConfig.js")(app);
// require("./middleware/checkPassport.js")(passport);
app.use(passport.initialize());
// app.use(passport.session());
//////
app.post(
  "/api/login",
  checkLogin.checkLogin,
  calendarLogin.saveTimeLogin,
  (req, res, next) => {
    response.response(res, req.user);
  }
);
//CRUD

app.use("/api/v1/users", usersRouter);
app.use("/api/v1", roomsRouter);
app.use("/api/v1/request", requestsRouter);
app.use("/api/v1/report", routerReport);

const PORT = process.env.port;

//ERROR

app.use((err, req, res, next) => {
  var statusCode = err.statusCode;
  var message = err.messageErr;
  res.status(statusCode).json(message);
});

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

app.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    // res.redirect("/login");
    // res.json({ status: 200, message: "LOGOUT SUCCESS" });
  });
});

app.listen(PORT, () => {
  console.log("CONNECT AT : " + PORT);
});
module.exports = { app };
