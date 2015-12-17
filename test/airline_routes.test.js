"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;

var airlinesIndex = require("../src/index.js");
var getRoutes = airlinesIndex.getRoutes;
var getAllRoutes = airlinesIndex.getAllRoutes;

var options = require("./fixtures/scraper_options.json");


describe("does the server works outside the suite?", function () {

  it("Should get the siteSub id value", function () {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("#siteSub").text();
      })
      .then(function (data) {
        expect(data).to.eql("From Wikipedia, the free encyclopedia");
      });
  });

});


describe("airline_routes.js: \n", function() {
  
  describe("getRoutes function", function () {

    it("Should be a function", function () {
      expect(getRoutes).to.be.a("function");
    });

    it("Should return an array from default scraper model", function (done) {
      getRoutes(options[0], function (err, results) {
        expect(results).to.be.an("array");
        done();
      });
    });

    it("Should return an array from table_with_origins scraper model", function (done) {
      // TODO: make it return an object and specify the schema all scrapers must follow.
      getRoutes(options[1], function (err, results) {
        expect(results).to.be.an("object");
        done();
      });
    });

    it("Should return an array from table scraper model", function (done) {
      getRoutes(options[2], function (err, results) {
        expect(results).to.be.an("array");
        done();
      });
    });

  });


  describe("getAllRoutes function", function () {

    it("Should be a function", function () {
      expect(getAllRoutes).to.be.a("function");
    });

  });
});

