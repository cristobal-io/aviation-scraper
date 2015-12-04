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

describe("server", function () {

  app.use(serveStatic(__dirname + MODELS_DIR));
  console.log("server started.");
  app.listen(PORT);

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

});
