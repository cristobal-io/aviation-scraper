"use strict";
// mocha
var chai = require("chai");
var expect = chai.expect;
// scraper
var sjs = require("scraperjs");
var scrapers = require("../scrapers/");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;

describe("Table Scraper: \n", function () {
  var results;

  before(function (done) {
    sjs.StaticScraper.create(SERVER_LISTENING + "/Aegean_Airlines_destinations.html")
      .scrape(scrapers.table)
      .then(function (data) {
        results = data;
        done();
      });
    
  });

  it("Should return and Array", function () {
    expect(results).to.be.an("array");
  });

});
