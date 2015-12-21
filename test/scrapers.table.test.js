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
    var tableDestSchema = require("../schema/destinations_table.schema.json");

    validateTableSchema = ajv.compile(tableDestSchema);

    var validTableSchema = validateTableSchema(results);

    expect(validTableSchema, _.get(validateTableSchema, "errors[0].message")).to.be.true;
  });

});
