"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

var source = require("../src/index.js");
var getAirports = source.getAirports;
var writeJson = source.writeJson;

var fs = require("fs");
var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var airlines = require("./fixtures/airlines.json");

describe("airports.js\n", function () {
  describe("getAirports", function () {

    it("should return only airports", function () {
      var airportsSchema = require("./fixtures/airport_schema.json");
      var airports = getAirports(airlines);
      var validateAirportsSchema = ajv.compile(airportsSchema);
      var validAirports = validateAirportsSchema(airports);

      expect(validAirports, _.get(validateAirportsSchema, "errors[0].message")).to.be.true;
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
            console.log(err);//eslint-disable-line no-console
          } 
          done();
        });
      });


    });

  });
});
