"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// server
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var MODELS_DIR = "/spec/models/";
var SERVER_LISTENING = BASE_URL + ":" + PORT;

before("start server", function () {
  app.use(serveStatic(__dirname + MODELS_DIR));
  isPortTaken(PORT, function (err, data) {
    if (!data) {
      app.listen(PORT);
    }
  });
});

describe("Server is on", function () {


  it("Confirm scraper is working with index.html", function (done) {
    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("Models");
        done();
      });
  });

  it("Check the page AeroSur_destinations is on", function (done) {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("AeroSur destinations");
        done();
      });
  });

});

describe("does it works outside the suite?", function() {

  it("Should get the siteSub id value", function (done) {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("#siteSub").text();
      })
      .then(function (data) {
        expect(data).to.eql("From Wikipedia, the free encyclopedia");
        done();
      });
  });

});

function isPortTaken(port, fn) {
  var net = require("net");
  var tester = net.createServer()
    .once("error", function (err) {
      if (err.code != "EADDRINUSE") {
        return fn(err);
      }
      fn(null, true);
    })
    .once("listening", function () {
      tester.once("close", function () {
        fn(null, false);
      })
        .close();
    })
    .listen(port);
}
