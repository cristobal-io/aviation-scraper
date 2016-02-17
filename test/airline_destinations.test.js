"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// dependencies
var _ = require("lodash");
var async = require("async");

var airlineRoutes = require("../src/airline_destinations.js");
var getDestinations = airlineRoutes.getDestinations;
var getAllDestinations = airlineRoutes.getAllDestinations;
var getFilename = airlineRoutes.getFilename;

var Ajv = require("ajv");
var ajv = Ajv();
var fs = require("fs");

var airports = require("./fixtures/airline_destinations.options.json");

describe("airline_destinations.js: \n", function () {
  var validateScraperTableSchema, validateDefaultSchema, validateTableSchema;

  before(function (done) {
    var defaultSchema = require("../schema/scraper.default.schema.json");


    validateScraperTableSchema = ajv.compile(defaultSchema);
    validateDefaultSchema = ajv.compile(defaultSchema);
    validateTableSchema = ajv.compile(defaultSchema);
    done();
  });

  describe("getFilename", function () {
    it("Should save the files with errors with a different message", function () {
      var badRoute = getFilename({
        "name": "bad_filename"
      });

      expect(badRoute.fileName).to.eql("./data/error_bad_filename.json");
    });
  });

  describe("getDestinations function", function () {

    it("Should return a validated schema from default scraper model", function (done) {
      this.timeout(15000);
      getDestinations(airports[0], function (err, results) {
        var valid = validateDefaultSchema(results.destinations);

        expect(valid, _.get(validateDefaultSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

    it("Should return a validated Schema from table scraper model", function (done) {

      getDestinations(airports[1], function (err, results) {
        var valid = validateScraperTableSchema(results.destinations);

        expect(valid, _.get(validateScraperTableSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

    it("Should return a validated Schema from table scraper model", function (done) {

      getDestinations(airports[2], function (err, results) {
        var valid = validateTableSchema(results.destinations);

        expect(valid, _.get(validateTableSchema, "errors[0].message")).to.be.true;
        done();
      });
    });

  });


  describe("getAllDestinations function", function () {
    var airportsResult = {};

    before(function (done) {
      this.timeout(15000);
      getAllDestinations(airports, function (err, airports) {
        airportsResult = airports;
        done();
      });
    });
    afterEach(function () {
      airportsResult.errors = 0;
    });

    it("Should return and save the file", function (done) {
      async.each(airportsResult, function (airport, callback) {
        // The structure of .destinations is being validated in other test.
        expect(_.has(airport, "destinations")).to.be.true;
        fs.unlink(airport.fileName, function (err) {
          if (err) {
            console.log(err); //eslint-disable-line no-console
          }
          callback();
        });
      }, done);
    });

    it("should have 0 errors returning from getAllDestinations", function () {
      var errorMessages = [];

      _.forEach(airportsResult, function (airport) {
        var errorMessage = _.get(airport, "errorMessage");

        if (errorMessage) {
          console.log(errorMessage); //eslint-disable-line no-console
          errorMessages.push(errorMessage);
        }
      });
      expect(airportsResult.errors, errorMessages).to.eql(0);
    });

  });

});
