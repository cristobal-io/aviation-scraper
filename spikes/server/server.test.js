"use strict";

var chai = require("chai");
var expect = chai.expect;

var http = require("http");

// var server = require("./server.js");

var express = require("express");
var serveStatic = require("serve-static");
var app = express();
var $ = require("jquery");

describe("server", function () {


  before(function (done) {
    app.use(serveStatic(__dirname));
    app.listen(3000);

    done();
  });

  after(function (done) {
    http.get("http://localhost:3000/index.html", function (res) {
      console.log("STATUS after: " + res.statusCode);
    });
    console.log("stopped");
    done();
  });

  it("Should fetch index.html", function (done) {
    http.get("http://localhost:3000/", function (res) {


      // res.setEncoding("utf8");
      res.on("data", function (chunk) {
        console.log("BODY: " + chunk);
      });
      res.on("data", function (body) {
        // console.log($(body).text());
        // 
        console.log("body: ", body);
        // expect(body).to.equal("test");
      });
      res.on("end", function () {
        console.log("No more data in response.");
      });
      done();
    });
  });

});
