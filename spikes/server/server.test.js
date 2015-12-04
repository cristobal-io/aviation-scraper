"use strict";

var chai = require("chai");
var expect = chai.expect;

var http = require("http");
var express = require("express");
var serveStatic = require("serve-static");
var app = express();

var sjs = require("scraperjs");

var BASE_URL = "http://localhost:3000/";

// var server = require("./server.js");

describe("server", function () {

  before(function (done) {
    app.use(serveStatic(__dirname));
    app.listen(3000);
    console.log("server started.");
    done();
  });

  after(function (done) {
    // if the server still runs, we would get the statusCode.
    http.get(BASE_URL, function (res) {
      console.log("STATUS after: " + res.statusCode);
    });
    console.log("Server stopped");
    done();
  });

  it("Should match h1 from index.html", function (done) {

    sjs.StaticScraper.create(BASE_URL)
    .scrape(function ($) {
      return $("h1").text();
    })
    .then(function (data) {
      expect(data).to.eql("this is a test file");
      done();
      // callback(null, data, options);
    });
  });

  it("Should fetch index.html", function (done) {

    sjs.StaticScraper.create(BASE_URL + "404.html")
    .scrape(function ($) {
      return $("h1").text();
    })
    .then(function (data) {
      expect(data).to.eql("this is a test file");
      done();
      // callback(null, data, options);
    });
  });

});
