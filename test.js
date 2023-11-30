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
let now = new Date();

console.log(now.toISOString());
console.log(now);
