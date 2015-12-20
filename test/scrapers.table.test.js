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

    // console.log(JSON.stringify(results, null, 2));
    // console.log(JSON.stringify(tableDestSchema, null, 2));
    var validTableSchema = validateTableSchema(results);

    if (!validTableSchema) {
      console.log(validateTableSchema.errors);
    }

    expect(validTableSchema).to.be.true;
    // assert.ok(true, console.log(validateTableSchema.errors));
  });

});
