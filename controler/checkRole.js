var checkRoleUser = function (req, res, next) {
  var role = req.body.infouser.role;
  console.log(role);
  if (role <= 1) {
    next();
  } else {
    res.redirect("/home");
  }
};
var checkRoleManager = function (req, res, next) {
  var role = req.body.infouser.role;
  if (role <= 2) {
    next();
  } else {
    res.redirect("/home");
  }
};
var checkRoleAdmin = function (req, res, next) {
  var role = req.body.infouser.role;
  if (role <= 3) {
    next();
  } else {
    res.redirect("/home");
  }
};

module.exports = { checkRoleUser, checkRoleManager, checkRoleAdmin };
