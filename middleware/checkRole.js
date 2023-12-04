// var checkRole = async function (req, res, next) {
//   var obj = req.user.data._id;
//   var id = obj.toHexString();
//   console.log(id);
//   return await usersModel
//     .findById({ _id: id })
//     .then((data) => {
//       return data.role;
//     })
//     .catch((err) => {
//       var error = new Error(err);
//       error.statusCode = 404;
//       throw error;
//     });
//   // console.log("CHECK::::" + username, password);
//   // return await usersModel
//   //   .findOne({ username: username, password: password })
//   //   .then((data) => {
//   //     req.body.data = data;

//   //     var newid = data._id;
//   //     //newid tra ve 1 object: new ObjectId("6531f755ca71de5b06f279fc")
//   //     var id = newid.toString();
//   //     // su dung toString de ra ket qua : 6531f755ca71de5b06f279fc
//   //     req.body.id = id;

//   //     var role = parseInt(data.role);
//   //     req.body.role = role;
//   //     // console.log("role:::::" + role);

//   //     return role;    }
//   //     )
//   //   .catch((err) => {
//   //     res.status(500).json(err);
//   //   });
// };

var decoded = require("../middleware/verifyToken");
var checkRoleUser = async function (req, res, next) {
  var role = req.user.role;

  if (role >= 1) {
    console.log("PASS ROLE USERS");
    next();
  } else {
    res.json("YOUR ROLE NOT ENOUGH");
  }
};

var checkRoleManager = async function (req, res, next) {
  // console.log(req.user);
  // var data = await decoded.decoded(req.user.token);
  // console.log(req.user);

  // console.log("role:::::" + role);
  var role = parseInt(req.user.role);
  console.log(role);
  if (role >= 2) {
    console.log("Pass check role");
    next();
  } else {
    res.json("YOUR ROLE NOT ENOUGH");
  }
};
var checkRoleAdmin = async function (req, res, next) {
  var role = req.user.data.role;
  console.log(role);
  if (role >= 3) {
    next();
  } else {
    res.json("YOUR ROLE NOT ENOUGH");
    // res.redirect("/home");
  }
};
module.exports = {
  checkRoleUser,
  checkRoleAdmin,
  checkRoleManager,
};
