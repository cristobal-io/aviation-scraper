"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// dependencies
var _ = require("lodash");
var async = require("async");

var airlinesIndex = require("../src/index.js");
var getRoutes = airlinesIndex.getRoutes;
var getAllRoutes = airlinesIndex.getAllRoutes;

var Ajv = require("ajv");
var ajv = Ajv();
var fs = require("fs");

var airports = require("./fixtures/airline_routes.options.json");

describe("Airline_routes.js: \n", function () {
  var validateScraperTableSchema, validateDefaultSchema, validateTableSchema;

  before(function (done) {
    var defaultSchema = require("../schema/scraper.default.schema.json");


    validateScraperTableSchema = ajv.compile(defaultSchema);
    validateDefaultSchema = ajv.compile(defaultSchema);
    validateTableSchema = ajv.compile(defaultSchema);
    done();
  });

  describe("getRoutes function", function () {

    it("Should return an array from default scraper model", function (done) {

      getRoutes(airports[0], function (err, results) {
        var valid = validateDefaultSchema(results.routes);

        expect(valid, _.get(validateDefaultSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

    it("Should return an array from table scraper model", function (done) {

      getRoutes(airports[1], function (err, results) {
        var valid = validateScraperTableSchema(results.routes);

        expect(valid, _.get(validateScraperTableSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

    it("Should return an array from table scraper model", function (done) {

      getRoutes(airports[2], function (err, results) {
        var valid = validateTableSchema(results.routes);

        expect(valid, _.get(validateTableSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

  });


  describe("getAllRoutes function", function () {
    var airportsResult = {};

    before(function (done) {
      this.timeout(15000);
      getAllRoutes(airports, function (err, airports) {
        airportsResult = airports;
        done();
      });
    });

    it("Should return and save the file", function (done) {
      async.each(airportsResult, function (airport, callback) {
        // The structure of .routes is being validated in other test.
        expect(_.has(airport, "routes")).to.be.true;
        fs.unlink(airport.fileName, function (err) {
          if (err) {
            console.log(err);
          } //eslint-disable-line no-console
          callback();
        });
        // callback();
      }, done);
    });

    it("should have 0 errors returning from getAllRoutes", function () {
      expect(airportsResult.errors).to.eql(0);
    });

  });

});
