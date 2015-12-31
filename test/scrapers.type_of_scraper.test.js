"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

chai.use(require("chai-json-schema"));

var airlinesIndex = require("../src/index.js");

var getScraperType = airlinesIndex.getScraperType;
var getScraperTypeForAll = airlinesIndex.getScraperTypeForAll;

var options = require("./fixtures/scraper_options.json");

var Ajv = require("ajv");
var ajv = Ajv();

describe("Type of Scraper\n", function () {
  var validateDestPagSchema;

  before(function () {
    var destinationsPagesSchema = require("../schema/destination_pages.schema.json");

    validateDestPagSchema = ajv.compile(destinationsPagesSchema);
  });

  it("Should return default scraper", function (done) {
    getScraperType(options[0], function (err, results) {
      expect(results.type).to.eql("default");
      done();
    });
  });

  // it("Should return default_variant scraper", function (done) {
  //   getScraperType(options[4], function (err, results) {
  //     expect(results.type).to.eql("default_variant");
  //     done();
  //   });
  // });

  it("Should return table scraper", function (done) {
    getScraperType(options[2], function (err, results) {
      expect(results.type).to.eql("table");
      done();
    });
  });

  it("Should return table_center scraper", function (done) {
    getScraperType(options[3], function (err, results) {
      expect(results.type).to.eql("table_center");
      done();
    });
  });

  it("Should return table_with_origins scraper", function (done) {
    getScraperType(options[1], function (err, results) {
      expect(results.type).to.eql("table_with_origins");
      done();
    });
  });


  it("Should return an array that passes the schema validation (AJV)", function (done) {

    getScraperTypeForAll(options[2], function (err, results) {
      if (err) {throw err;}

      var validDestPagSchema = validateDestPagSchema(results);

      if (!validDestPagSchema) {
        console.log(validateDestPagSchema.errors);// eslint-disable-line no-console
      }
      expect(validDestPagSchema).to.be.true;

      done();
    });
  });

  it("Should return an array that passes the schema validation (TV4)", function (done) {

    var destinationsPagesSchema = require("../schema/destination_pages.schema.json");

    // console.log("destinationsPagesSchema: \n", JSON.stringify(destinationsPagesSchema, null, 2));


    getScraperTypeForAll(options[2], function (err, results) {
      if (err) {throw err;}

      var valid = chai.tv4.validate(results, destinationsPagesSchema);

      if (!valid) {
        console.log("error: ", chai.tv4.error.message);// eslint-disable-line no-console
      }
      expect(results).to.be.jsonSchema(valid);

      chai.tv4.dropSchemas();
      done();
    });
  });

});
