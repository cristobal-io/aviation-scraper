"use strict";

// Mocha
var expect = require("expect.js");

var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var airlines = require("./fixtures/airlines.json");

var airlineJs = require("../src/airline.js");
var getAirlineData = airlineJs.getAirlineData;
var callScraper = airlineJs.callScraper;
var callScraperForEachLink = airlineJs.callScraperForEachLink;
var getAllAirlinesLinks = airlineJs.getAllAirlinesLinks;
var getAllAirlinesData = airlineJs.getAllAirlinesData;

var BASE_URL = "http://localhost:3000/";
var airlineDataExpected = require("./fixtures/airline.data.test.json");

describe("airline.js\n", function () {

  describe("getAirlineData", function () {

    it("should return a valid data schema", function (done) {
      var airlineDefaultSchema = require("../schema/airline.schema.json");
      var validateAirlineSchema = ajv.compile(airlineDefaultSchema);

      getAirlineData( airlines[0], function (err, data) {
        if (err) {
          console.log("err: %s", err); //eslint-disable-line no-console
        }
        var validAirline = validateAirlineSchema([data]);

        expect(validAirline,
          _.get(validateAirlineSchema, "errors[0].message")).to.be(true);
        done();
      });
    });
  });

  describe("get airlines links scraper meet the schema.", function () {

    it("should meet with the valid schema.", function (done) {

      callScraper(BASE_URL + airlines[2], "airlineLinks", function (err, data) {
        var airlinesLinksSchema = require("../schema/airlines_links.schema.json");
        var validateAirlineLinksSchema = ajv.compile(airlinesLinksSchema);

        if (err) {
          console.log("err: %s", err); //eslint-disable-line no-console
        }
        var validAirlineLinks = validateAirlineLinksSchema(data);

        if (!validAirlineLinks) {
          console.log("the schema is not valid,", //eslint-disable-line no-console
            _.get(validateAirlineLinksSchema,
              "errors[0].message"));
        }
        expect(validAirlineLinks).to.be(true);
        // the schema is not strict, so to validate that all the data is being
        // saved, we have this second verification.
        expect(data).to.eql(airlineDataExpected);
        done();

      });
    });

  });

  describe("using callScraperForEachLink should", function () {

    it("return data with the airports", function (done) {
      var airlineDefaultSchema = require("../schema/airline.schema.json");
      var validateAirlineSchema = ajv.compile(airlineDefaultSchema);

      callScraperForEachLink([
        BASE_URL + airlines[0],
        BASE_URL + airlines[1]
      ], "airline", function (err, results) {
        if (err) {throw err;}
        var validAirline = validateAirlineSchema(results);

        if (!validAirline) {
          console.log("the schema is not valid,", //eslint-disable-line no-console
            _.get(validateAirlineSchema,
              "errors[0].message"));
        }

        expect(validAirline).to.be(true);

        done();
      });
    });

    it("should scrape all the airports with the info passed coming from airlineLinks scraper.", function (done) {
      var airlineDefaultSchema = require("../schema/airline.schema.json");
      var validateAirlineSchema = ajv.compile(airlineDefaultSchema);
      var url = BASE_URL + airlines[2];

      getAllAirlinesLinks(url, function (err, links) {
        if (err) {throw err;}
        // console.log(links);
        getAllAirlinesData(links, function (err, airlines) {
          var validAirlines = validateAirlineSchema(airlines);

          expect(validAirlines).to.be(true);
          done();
        });

      });
    });
  });

});
