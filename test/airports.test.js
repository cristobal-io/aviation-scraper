"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

var source = require("../src/index.js");
var getAirports = source.getAirports;
var writeJson = source.writeJson;
var getAirportData = source.getAirportData;

var fs = require("fs");
var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var airlines = require("./fixtures/airlines.json");

describe.only("airports.js\n", function () {
  describe("getAirports", function () {

    it("should return only airports", function () {
      var airportsSchema = require("./fixtures/airport_schema.json");
      var airports = getAirports(airlines);
      var validateAirportsSchema = ajv.compile(airportsSchema);
      var validAirports = validateAirportsSchema(airports);

      expect(validAirports, _.get(validateAirportsSchema, "errors[0].message")).to.be.true;
    });

    it("Should not have duplicated airports", function (done) {
      var airlinesDestinations = require("./fixtures/airlines_destinations.json");
      var airports = getAirports(airlinesDestinations);

      _.map(_.groupBy(airports, function (airport) {
        return airport.name;
      }), function (grouped) {
        expect(grouped).to.have.length(1);
      });
      done();
    });


  });

  describe("writeJson", function () {

    it("Should save a file", function (done) {
      var fileName = "./data/sampleObject.json",
        fileExists;
      var sampleObject = {
        "foo": "bar"
      };

      // bermi how do I test writeJson if there wasn't a callback?
      writeJson(sampleObject, fileName, function () {
        fileExists = fs.readFileSync(fileName, "utf8");
        expect(fileExists).to.eql("{\n  \"foo\": \"bar\"\n}");
        fs.unlink(fileName, function (err) {
          if (err) {
            console.log(err); //eslint-disable-line no-console
          }
          done();
        });
      });
    });

  });

  describe("airports.js", function () {

    it("should return the airport data with the proper schema", function (done) {
      this.timeout(15000);

      var airportDataSchema = require("./fixtures/airport_data.schema.json");
      var validateAirportDataSchema = ajv.compile(airportDataSchema);
      var airportLink = require("./fixtures/airport_links.json");

      getAirportData(airportLink, function(err, airportsData) {
        var validAirportData = validateAirportDataSchema(airportsData);
        
        console.log(airportsData);
        expect(validAirportData, _.get(validateAirportDataSchema, "errors[0].message")).to.be.true;
        done();
      });

    });

  });

});
