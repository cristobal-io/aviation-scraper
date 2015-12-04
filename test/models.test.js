"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// server
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
var http = require("http");
// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var MODELS_DIR = "/spec/models/";
var SERVER_LISTENING = BASE_URL + ":" + PORT;

describe("server", function () {

  debugger;
  before("tests", function (done) {
    // body...
    startServer();
    done();
  });

  it("Should match H1 from index.html", function (done) {

    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("Models");
        done();
      });
  });

  it("True or false test", function () {
    expect(true).to.be.true;
  });

});

function getStatusCode() {
  var statusCode = http.get(SERVER_LISTENING, function (res) {
    return res.statusCode ;
  });

  return statusCode;
}

function startServer() {

  if (getStatusCode() !== 200) {
    app.use(serveStatic(__dirname + MODELS_DIR));
    console.log("server started.");
    app.listen(PORT);
    console.log("listening");
  } else {
    console.log("status code: 200");
  }
}
