const express = require("express");
var routerManagerUsers = express.Router();
const userModel = require("../models/users");
//CONST
const ADMIN_ROLE = 3;
const MANAGER_ROLE = 2;
const USER_ROLE = 1;
routerManagerUsers.post("/myinfo", (req, res, next) => {
  var id = req.body.id;
  userModel
    .findById({ _id: id })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
//chi co quyen cao hon moi dc xem quyen thap hon

routerManagerUsers.get("/usermanager", (req, res) => {
  var role = req.body.role;
  console.log(role);
  if (role >= ADMIN_ROLE) {
    userModel
      .find({})
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("HAS ERR HERE: " + err);
      });
  }
  if (role >= MANAGER_ROLE) {
    userModel
      .find({ role: { $lt: MANAGER_ROLE } })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("HAS ERR HERE: " + err);
      });
  }
  if (role >= USER_ROLE) {
    userModel
      .find({ role: { $lt: USER_ROLE } })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json("HAS ERR HERE: " + err);
      });
  }
});
// routerManagerUsers.post("/usermanager", (req, res) => {
//   var role = req.body.role;
//   var { username, password, name, address, phone, role, note } = req.body;
//   if (role === 3) {
//     usersModel
//       .findOne({ username: username })
//       .then((data) => {
//         if (data) {
//           res.json("User name has been used");
//         } else {
//           usersModel
//             .create({
//               username: username,
//               password: password,
//               name: name,
//               address: address,
//               phone: phone,
//               role: role,
//               note: note,
//             })
//             .then(res.json("Create user complete!!"))
//             .catch((err) =>
//               res.status(500).json("Create fails, have error: " + err)
//             );
//         }
//       })
//       .catch((err) => {
//         res.json("HAVE ERRO: " + err);
//       });
//   }
// });
routerManagerUsers.get("/settings", (req, res) => {
  var username = req.body.username;
  userModel
    .findOne({ username: username })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});
routerManagerUsers.put("/usermanager", (req, res) => {});
routerManagerUsers.delete("/usermanager", (req, res) => {
  var idList = req.body._id;
  userModel
    .deleteMany({ id: { $in: idList } })
    .then((data) => {
      "DELETE SUCCESS";
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = routerManagerUsers;
