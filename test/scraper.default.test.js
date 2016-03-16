"use strict";
var scrapers = require("../scrapers/");
var defaultScraper = scrapers.default;
var getDestination = defaultScraper.getDestination;
var getDestinationsPages = defaultScraper.getDestinationsPages;
var getLinkStrings = defaultScraper.getLinkStrings;
var hasValidLinks = defaultScraper.hasValidLinks;
var getLinkInfo = defaultScraper.getLinkInfo;

var md = require("html-md");

var chai = require("chai");
var expect = chai.expect;
var strings = require("./fixtures/test_strings.json");

chai.use(require("chai-json-schema"));

describe("Default Scraper: \n", function () {


  var result, line;

  before(function (done) {
    line = strings["line"];
    result = getDestination(line);
    done();
  });

// For consistency we should use only one method but for learning I am going
// to leave the 3 methods.
  describe("getDestination function, it: ", function () {
    var destinationSchema = {
      "title": "destination schema v1",
      "type": "object",
      "required": ["city", "airport"],
      "properties": {
        "city": {
          "type": "object",
          "minItems": 1,
          "uniqueItems": true,
          "required": ["name", "url"],
          "properties": {
            "name": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "items": {
            "type": "string"
          }
        },
        "airport": {
          "type": "object",
          "minItems": 1,
          "uniqueItems": true,
          "required": ["name", "url"],
          "properties": {
            "name": {
              "type": "string"
            },
            "url": {
              "type": "string"
            }
          },
          "items": {
            "type": "string"
          }
        }
      }
    };


    it("Should return an object", function () {
      expect(result).to.be.an("object");
    });

    it("Should verify the object's structure", function () {
      expect(result).to.be.jsonSchema(destinationSchema);
    });
  });

  describe("getDestinationsPages function, it: ", function () {
    var makrdown, makrdownResults;

    before(function () {
      makrdown = md(strings.markdown, {
        inline: true
      });
      makrdownResults = getDestinationsPages(makrdown);
    });


    it("should return an Array", function () {
      expect(makrdownResults).to.be.an("array");
    });

    it("Shouldn't be an empty array", function () {
      expect(makrdownResults.length).to.be.above(1);
    });
  });

  describe("getLinkStrings function, it:", function () {
    var linkStringResult;

    before(function () {
      linkStringResult = getLinkStrings(line);
    });


    it("Should return an array ", function () {

      expect(linkStringResult).to.be.an("array");
    });

    it("Shouldn't return an empty array", function () {
      expect(linkStringResult.length).to.be.above(1);
    });
  });

  describe("hasValidLinks function, it:", function () {
    var link, hasValidLinksResult;

    before(function () {
      link = strings.link;
      hasValidLinksResult = hasValidLinks(link);
    });


    it("Shouldn't return undefined", function () {
      expect(hasValidLinksResult).to.not.be.undefined;
    });

    it("Should return the last right element", function () {
      expect(hasValidLinksResult).to.be.true;
    });
    it("Should check for all the links", function () {
      var link_0_1_false = strings.link_0_1_false;
      var link_0_2_false = strings.link_0_2_false;
      var link_1_1_false = strings.link_1_1_false;
      var link_1_2_false = strings.link_1_2_false;

      expect(hasValidLinks(link_0_1_false)).not.to.be.ok;
      expect(hasValidLinks(link_0_2_false)).not.to.be.ok;

      expect(hasValidLinks(link_1_1_false)).not.to.be.ok;
      expect(hasValidLinks(link_1_2_false)).not.to.be.ok;

    });
  });

  describe("getLinkInfo function, it:", function () {

    it("Should return an array", function () {
      expect(getLinkInfo(line)).to.be.an("array");
    });

    it("Should return a length of 3", function () {
      expect(getLinkInfo(line).length).to.be.above(2);
    });
    it("Should match the returned values", function () {
      var getLinkInfoResult = getLinkInfo(line);
      var re = "\\[([^\\[]+)\\]\\(([^\\)]+)\\)";
      var linksInfoRe = new RegExp(re);

      expect(getLinkInfoResult[0]).to.match(linksInfoRe);
      expect(getLinkInfoResult[2]).to.match(/^\/wiki\/\w*/);
      expect(getLinkInfoResult[2]).not.to.match(/\/wiki\/\w*\s+"\w+"$/);

    });

  });
});
