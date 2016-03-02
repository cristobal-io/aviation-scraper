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
var BASE_URL = "http://localhost:3000/";
var airlineDataExpected = require("./fixtures/airline.data.test.json");

describe("airline.js\n", function () {

  describe("getAirlineData", function () {

    it("should return a valid data schema", function (done) {
      var airlineDefaultSchema = require("../schema/airline.schema.json");
      var validateAirlineSchema = ajv.compile(airlineDefaultSchema);

      getAirlineData(BASE_URL + airlines[0], function (err, data) {
        // Bermi, this is really extrange, it gets the error from what I am calling inside
        // the expect error.
        if (err) {
          console.log("err: %s", err); //eslint-disable-line no-console
        }
        // console.log(JSON.stringify(data,null,2));
        var validAirline = validateAirlineSchema([data]);

        // console.log(JSON.stringify(validateAirlineSchema.errors,null,2));
        expect(validAirline, _.get(validateAirlineSchema, "errors[0].message")).to.be(true);
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

});
