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

//////
// let queryCondition = {};
// let dieuKienLoc = req.body;
// Object.keys(dieuKienLoc).forEach((key) => {
//   queryCondition[key] = dieuKienLoc[key];
// });
//////
let isBooking = {};
isBooking.isBooking = true;
console.log(isBooking);

const data = { isBooking: true };
console.log(data);
