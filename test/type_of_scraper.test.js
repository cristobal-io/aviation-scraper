"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

var airlinesIndex = require("../src/index.js");

var getScraperType = airlinesIndex.getScraperType;
var getScraperTypeForAll = airlinesIndex.getScraperTypeForAll;

var options = require("./spec/data/scraper_options.json");

describe("Type of Scraper", function () {

  it("Should return default scraper", function (done) {
    getScraperType(options[0], function (err, results) {
      expect(results.type).to.eql("default");
      done();
    });
  });

  it("Should return table_with_origins scraper", function (done) {
    getScraperType(options[1], function (err, results) {
      expect(results.type).to.eql("table_with_origins");
      done();
    });
  });

  it("Should return table scraper", function (done) {
    getScraperType(options[2], function (err, results) {
      expect(results.type).to.eql("table");
      done();
    });
  });

  it("Should return and save the type_of_scrapper for all airports", function (done) {
    var destinationsPagesSchema = {
      "title": "destination pages schema v1",
      "type": "object",
      "required": ["name", "destinationsLink", "scraper"],
      "properties": {
        "name": {
          "type": "string",
          "minItems": 1,
          "uniqueItems": true
        },
        "destinationsLink": {
          "type": "string"
        },
        "scraper": {
          "type": "string"
        }
      }
    };
    //require("./schema/destination_pages.schema.json");
    // BERMI: no way to get this from a json file, not working :(

    getScraperTypeForAll(options[2], function (results) {
      // console.log(results);
      expect(results).to.be.an("array");
      for (var i = 0; i < results.length; i += 1) {
        expect(results[i]).to.be.jsonSchema(destinationsPagesSchema);
      }
      done();
    });
  });

});
