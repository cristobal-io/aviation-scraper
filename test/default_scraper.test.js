"use strict";
var defaultScraper = require("../scrapers/default.js");
var getDestination = defaultScraper.getDestination;
var getDestinations = defaultScraper.getDestinations;
var getLinkStrings = defaultScraper.getLinkStrings;
var hasValidLinks = defaultScraper.hasValidLinks;
var getLinkInfo = defaultScraper.getLinkInfo;

var md = require("html-md");

var chai = require("chai");
var expect = chai.expect;
var strings = require("./strings/test_strings.json");

// var tv4 = require(tv4);

chai.use(require("chai-json-schema"));
var result, line;

before(function (done) {
  console.log("NODE_ENV: %s \n", process.env.NODE_ENV);

  line = strings["line"];
  // destinationSchema = chai.tv4.getSchema("./schema/destination_schema.json");

  result = getDestination(line);
  // console.log(destinationSchema);
  done();
});

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
  // require("./schema/destination_schema.json");


  it("Should be a function", function () {
    expect(getDestinations).to.be.a("function");
  });
  it("Should return an object", function () {
    expect(result).to.be.an("object");
  });

  it("Should verify the object's structure", function () {
    expect(result).to.be.jsonSchema(destinationSchema);
  });
});

describe("getDestinations function, it: ", function () {
  var makrdown, makrdownResults;

  before(function () {
    makrdown = md(strings.markdown, {
      inline: true
    });
    makrdownResults = getDestinations(makrdown);
  });

  it("Should be a function", function () {
    expect(getDestinations).to.be.a("function");
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

  it("Should be a function", function () {
    expect(getLinkStrings).to.be.a("function");
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

  it("Should be a function", function () {
    expect(hasValidLinks).to.be.a("function");
  });

  it("Shouldn't return undefined", function () {
    expect(hasValidLinksResult).to.not.be.undefined;
  });

  it("Should return the last right element", function () {
    expect(hasValidLinksResult).to.match(/^\/wiki\//);
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
  it("Should be a function", function () {
    expect(getLinkInfo).to.be.a("function");
  });

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
