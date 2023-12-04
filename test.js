// var dieuKienLoc = req.body;
// const queryConditions = {};
// Object.keys(dieuKienLoc).forEach((key) => {
//   queryConditions[key] = dieuKienLoc[key];
// });
// requestModel
//   .find(queryConditions)
//   .then((data) => {
//     res.json({ data: data });
//   })
//   .catch((err) => {
//     var error = new Error(err);
//     error.statusCode = 400;
//     throw error;
//   });
require("dotenv").config();
let test = process.env.port;
console.log(test);
