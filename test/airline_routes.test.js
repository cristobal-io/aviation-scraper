"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// dependencies
var _ = require("lodash");

var airlinesIndex = require("../src/index.js");
var getRoutes = airlinesIndex.getRoutes;
var getAllRoutes = airlinesIndex.getAllRoutes;

var Ajv = require("ajv");
var ajv = Ajv();

var options = require("./fixtures/scraper_options.json");


describe("Airline_routes.js: \n", function () {
  var validateScraperTableSchema;

  before(function (done) {
    var scraperTableOriginSchema = require("../schema/destinations_table_origin.schema.json");

    validateScraperTableSchema = ajv.compile(scraperTableOriginSchema);
    done();
  });

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

    it.only("Should return an array from table_with_origins scraper model", function (done) {
      // TODO: make it return an object and specify the schema all scrapers must follow.
      getRoutes(options[1], function (err, results) {

        // console.log(results);
        var valid = validateScraperTableSchema(results);

        expect(valid, _.get(validateScraperTableSchema, "errors[0].message") ).to.be.true;
        // expect(results).to.be.an("object");
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
