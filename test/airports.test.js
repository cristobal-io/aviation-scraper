"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
var assert = require("assert");
var airportsJs = require("../src/airports.js");
var getAirports = airportsJs.getAirports;
var writeJson = airportsJs.writeJson;
var getAirportsData = airportsJs.getAirportsData;
var getData = airportsJs.getData;
var getAirportFileName = airportsJs.getAirportFileName;

var fs = require("fs");
var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var BASE_DIR = "./tmp";

describe("airports.js\n", function () {
  var airlinesDestinations, airportsLink, airportsSchema, airports,
    missingCoordinatesAirports;

  describe("all airports should have coordinates", function() {
    try {
      airports = require("../tmp/airports.json");
      missingCoordinatesAirports = airports.reduce(function(result, airport) {
        if (!airport.data.coordinates.latitude || !airport.data.coordinates.longitude) {
          // console.log(airport);
          result.push(airport);
        }
        return result;
      }, []);
      it("all the airports should have coordinates", function() {
        assert.equal(missingCoordinatesAirports.length, 0);
      });
    } catch (e) {
      it.skip("should exist airports.json file", function() {
        console.log(e);
      });
    }

  });
  before(function () {
    airlinesDestinations = require("./fixtures/airlinesDestinations.json");
    airportsLink = require("./fixtures/airport_links.json");
    airportsSchema = require("../schema/airport_data.schema.json");
    airlinesDestinations.save = true;

  });
  describe("getAirports", function () {

    it("should return only airports", function () {
      var airportsSchema = require("../schema/airport_links.schema.json");
      var airports = getAirports(airlinesDestinations);
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

    it("should include the name, nickname and website of the airport.", function (done) {
      var airportLocalLink = {
        name: "Amsterdam Airport Schiphol",
        url: "http://localhost:3000/Amsterdam_Airport_Schiphol",
        baseDir: BASE_DIR
      };

      getData(airportLocalLink, function (err, airport) {
        if (err) {
          throw err;
        }
        // console.log(JSON.stringify(airportData,null,2));
        expect(airport.data.name, "it doesn't include the name").to.eql("Amsterdam Airport Schiphol");
        expect(airport.data.nickname, "it doesn't include the nickname").to.eql("Luchthaven Schiphol");
        expect(airport.data.website, "it doesn't include the website").to.eql("http://www.schiphol.com/");
        done();
      });

    });


  });

  describe("getData", function () {
    it("Should return valid schema data", function () {
      var validateAirportsDataSchema = ajv.compile(airportsSchema);
      var airportLocalLink = {
        name: "Amsterdam Airport Schiphol",
        url: "http://localhost:3000/Amsterdam_Airport_Schiphol"
      };

      getData(airportLocalLink, function (err, airportData) {
        var validAirportsData = validateAirportsDataSchema([airportData]);

        expect(validAirportsData, _.get(validateAirportsDataSchema, "errors[0].message")).to.be.true;
      });
    });

  });
  describe("getAirportFileName", function () {

    it("Should save the files with the proper name", function () {
      var airportData = require("./fixtures/airport_data.json");
      var godAirportName = getAirportFileName(airportData[0], BASE_DIR);

      expect(godAirportName).to.eql(BASE_DIR + "/airport_Tirana_International_Airport_Nënë_Tereza.json");
    });

    it("Should save the files with errors with a different message", function () {
      var badAirportName = getAirportFileName({
        "url": "http://localhost:3000/bad_filename"
      }, BASE_DIR);

      expect(badAirportName).to.eql(BASE_DIR + "/airport_error_bad_filename.json");
    });

  });

  describe("writeJson", function () {

    it("Should save a file", function (done) {
      var fileName = BASE_DIR + "/sampleObject.json",
        fileExists;
      var sampleObject = {
        "foo": "bar"
      };

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

  describe("getAirportsData", function () {

    it("should return the airport data with the proper schema", function (done) {
      this.timeout(15000);
      var airportsLocalLinks = {
        "links": airportsLink,
        "baseDir": BASE_DIR,
        "save": true
      };
      var airportDataSchema = require("../schema/airport_data.schema.json");
      var validateAirportDataSchema = ajv.compile(airportDataSchema);

      getAirportsData(airportsLocalLinks, function (err, airportsData) {
        // console.log(JSON.stringify(airportsData,null,2));
        var validAirportData = validateAirportDataSchema(airportsData);


        // console.log(JSON.stringify(airportsData,null,2));
        expect(validAirportData, _.get(validateAirportDataSchema, "errors[0].message")).to.be.true;
        _.map(airportsData, function (airportData) {
          expect(airportData.data.errorMessage).to.not.exist;
          var fileName = getAirportFileName(airportData, BASE_DIR);

          fs.unlink(fileName, function (err) {
            if (err) {
              throw err;
            }
          });

        });
        done();
      });
    });

  });

});
