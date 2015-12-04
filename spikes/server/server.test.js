"use strict";

var chai = require("chai");
var expect = chai.expect;

var http = require("http");
var express = require("express");
var serveStatic = require("serve-static");
var app = express();

var sjs = require("scraperjs");

var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;
var ERROR_PAGE = "/404.html";

describe("server", function () {

  before(function (done) {
    app.use(serveStatic(__dirname));
    app.listen(PORT);
    console.log("server started.");
    done();
  });

  after(function (done) {
    // if the server still runs, we would get the statusCode.
    http.get(SERVER_LISTENING, function (res) {
      console.log("STATUS after: " + res.statusCode);
    });
    console.log("Server stopped");
    done();
  });

  it("Should match h1 from index.html", function (done) {

    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("this is a test file");
        done();
      });
  });

  it("Should fetch index.html", function (done) {

    sjs.StaticScraper.create(SERVER_LISTENING + ERROR_PAGE)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("Not found");
        done();
      });
  });

});
