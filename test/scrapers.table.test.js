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

var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var defaultSchema = require("../schema/scraper.default.schema.json");

// chai.config.includeStack = true;

describe("Table Scraper: \n", function () {
  var results, validateTableSchema;

  before(function (done) {

    sjs.StaticScraper.create(SERVER_LISTENING + "/Aegean_Airlines_destinations.html")
      .scrape(scrapers.table)
      .then(function (data) {
        results = data;
        done();
      });

  });

  it("Should return and Array that passes the table schema validation", function () {
    var tableDestSchema = require("../schema/scraper.default.schema.json");

    validateTableSchema = ajv.compile(tableDestSchema);

    var validTableSchema = validateTableSchema(results);

    expect(validTableSchema, _.get(validateTableSchema, "errors[0].message")).to.be.true;
  });

  it("should check special case where an airport is shared between rows", function (done) {
    var validateDefaultSchema = ajv.compile(defaultSchema);

    sjs.StaticScraper.create(SERVER_LISTENING + "/Air_Arabia_Maroc_destinations.html")
      .scrape(scrapers.table)
      .then(function (data) {
        var validDefaultSchema = validateDefaultSchema(data);

        expect(validDefaultSchema, _.get(validateDefaultSchema, "errors[0].message")).to.be.true;
        done();
      });
  });

  it("Should check special Case where there is no City and instead it says Destination", function (done) {
    var validateDefaultSchema = ajv.compile(defaultSchema);

    sjs.StaticScraper.create(SERVER_LISTENING + "/Air_Chathams_destinations.html")
      .scrape(scrapers.table)
      .then(function (data) {
        var validDefaultSchema = validateDefaultSchema(data);

        expect(validDefaultSchema, _.get(validateDefaultSchema, "errors[0].message")).to.be.true;
        done();
      });
  });

  it("Should test Special case where the airport doesn't match exactly", function (done) {
    // Bermi: the right link to include here it is Aeroper%C3%BA_destinations but I've seen it makes the test
    // fail, I can fix it if I change the name, but it is going to fail again if we update the models.
    var validateDefaultSchema = ajv.compile(defaultSchema);

    sjs.StaticScraper.create(SERVER_LISTENING + "/Aeroperu_destinations.html")
      .scrape(scrapers.table)
      .then(function (data) {
        var validDefaultSchema = validateDefaultSchema(data);

        expect(validDefaultSchema, _.get(validateDefaultSchema, "errors[0].message")).to.be.true;
        done();
      });
  });

});
