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
var fs = require("fs");

describe("Airline_routes.js: \n", function () {
  var options = require("./fixtures/airline_routes.options.json");
  var validateScraperTableSchema, validateOptionalSchema;

  before(function (done) {
    var optionalSchemaTable = require("../schema/routes.table_w_origins.schema.json");
    var scraperTableOriginSchema = require("../schema/destinations_table_origin.schema.json");

    validateScraperTableSchema = ajv.compile(scraperTableOriginSchema);
    validateOptionalSchema = ajv.compile(optionalSchemaTable);
    done();
  });

  describe("getRoutes function", function () {

    it("Should be a function", function () {
      expect(getRoutes).to.be.a("function");
    });

    it("Should return an array from default scraper model", function (done) {
      // todo: complete the test with json ajv

      getRoutes(options[0], function (err, results) {
        // console.log(results.routes);
        expect(results.routes).to.be.an("array");
        done();
      });
    });

    it("Should return an array from table_with_origins scraper model", function (done) {

      getRoutes(options[1], function (err, results) {

        var valid = validateScraperTableSchema(results.routes);

        expect(valid, _.get(validateScraperTableSchema, "errors[0].message")).to.be.true;
        // bermi: do I have to use always anywere I can map over forEach to avoid side effects?
        _.map(results.routes, function (results) {
          var validOptionalSchema = validateOptionalSchema(results);

          expect(validOptionalSchema, _.get(validateOptionalSchema, "errors[0].message")).to.be.ok;
        });
        done();
      });
    });

    it("Should return an array from table scraper model", function (done) {
      // todo: complete the test with json ajv

      getRoutes(options[2], function (err, results) {
        expect(results.routes).to.be.an("array");
        done();
      });
    });

  });


  describe("getAllRoutes function", function () {

    it("Should be a function", function () {
      expect(getAllRoutes).to.be.a("function");
    });

    it("Should return and save the file", function (done) {
      // bermi: this test takes really long and we need increase the timeout
      this.timeout(5000);
      // bermi: when calling this function, I am creating side effects, I am adding routes to options object.
      // Should I avoid it or it is ok in test cases?
      getAllRoutes(options, function (err, options) {
        for (var i = 0; i < options.length; i+=1) {
          // Bermi: since we are testing the schema integrity in other test, this I think it should test that is 
          // returning the proper object. Do you think this is a valid way of testing it?
          expect(_.has(options[i], "routes")).to.be.true;
          // bermi: is it a good way of deleting files created for this test.
          fs.unlinkSync(options[i].destinationsFile);
        }
        done();
      });
    });

  });
});
