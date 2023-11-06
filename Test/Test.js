const mongoose = require("mongoose");
const request = require("supertest");
const expect = require("chai").expect;
// const _ = require("lodash");
// const uuidv4 = require("uuid/v4");
// const jwt = require("jsonwebtoken");
var express = require("express");
var app = express();

const createTest = (endpoint) => {
  return (payload, statusCode, errorMessage, done) => {
    request(app)
      .post(endpoint)
      .send(payload)
      .expect(statusCode)
      .expect({ error: errorMessage }, done);
  };
};
describe("'End point:POST /login '", (done) => {
  const endPoint = "/login";
  const test = createTest(endPoint);
  it(`POST ${endPoint} - success`, () => {
    const payLoad = {
      username: "3",
      password: "32221",
    };
    test(payLoad, 400, "Login Success", done);
    // expect().to.be.true;
  });
  it(`POST ${endPoint} - Wrong Password`, () => {
    const account = {
      username: "3",
      password: "1231231232",
    };
    test(account, 401, "WRONG PASSWORD", done);
  });
  it(`POST ${endPoint} - Wrong Password1`, () => {
    // const account = {
    //   // username: "3",
    //   // password: "1231231232",
    // };
    var a = 5;
    test(a, 401, "WRONG PASSWORD", done);
  });
});
