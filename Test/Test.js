// const mongoose = require("mongoose");
// const request = require("supertest");
// const expect = require("chai").expect;
// // const _ = require("lodash");
// // const uuidv4 = require("uuid/v4");
// // const jwt = require("jsonwebtoken");
// var express = require("express");
// var app = express();
// var assert = require("assert");

// const createTest = (endpoint) => {
//   return (payload, statusCode, errorMessage, done) => {
//     request(app)
//       .post(endpoint)
//       .send(payload)
//       .expect(statusCode)
//       .expect({ error: errorMessage }, done);
//   };
// };
// describe("'End point:POST /login '", (done) => {
//   const endPoint = "/login";
//   const test = createTest(endPoint);
//   it(`POST ${endPoint} - success`, () => {
//     const payLoad = {
//       username: "3",
//       password: "3123123",
//     };
//     test(payLoad, 400, "Login Success", done);
//     // expect().to.be.true;
//   });
//   it(`POST ${endPoint} - Wrong Password`, () => {
//     const account = {
//       username: "3",
//       password: "1231231232",
//     };
//     test(account, 401, "WRONG PASSWORD", done);
//   });
//   it(`POST ${endPoint} - Wrong Password1`, () => {
//     // const account = {
//     //   // username: "3",
//     //   // password: "1231231232",
//     // };
//     var a = 5;
//     test(a, 401, "WRONG PASSWORD", done);
//   });
// });
var supertest = require("supertest");
var app = require("../server");
const { response } = require("express");
const { expect } = require("chai");
describe("POST /", () => {
  describe("HAVE USERNAME AND PASSWORD", () => {
    test("RES 200 WHEN TRUE", async () => {
      const response = await request(app).post("/login").send({
        username: "3",
        password: "3",
      });
      expect(response.statusCode.toBe(200));
    });
  });
  describe("NOT ENOUGH USERNAME AND PASSWORD", () => {});
});
