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
var local_pages_DIR = "/spec/local_pages/";
var SERVER_LISTENING = BASE_URL + ":" + PORT;

before("start server", function (done) {
  app.use(serveStatic(__dirname + local_pages_DIR));
  isPortTaken(PORT, function (err, data) {
    if (!data) {
      app.listen(PORT);
    }
    done();
  });
});

after(function () {
  console.log("NODE_ENV: %s \n", process.env.NODE_ENV); //eslint-disable-line no-console

});

describe.only("Server is on \n", function () {

  it("Confirm server & scraper are working with index.html", function () {
    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("local_pages");
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
