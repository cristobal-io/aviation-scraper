"use strict";
var defaultScraper = require("../scrapers/default.js");
var getDestination = defaultScraper.getDestination;
var getDestinations = defaultScraper.getDestinations;
var getLinkStrings = defaultScraper.getLinkStrings;

var md = require("html-md");
// var sjs = require("scraperjs");

var chai = require("chai");
var expect = chai.expect;


chai.use(require("chai-json-schema"));
var result, line;

beforeEach(function () {
  line = "[Madrid](/wiki/Madrid \"Madrid\") - [Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")";

  return result = getDestination(line);
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
  // var makrdownResultsSchema = {
  //   "title": "destination schema v1",
  //   "type": "array",
  //   "required": ["city", "airport"],
  //   "properties": {
  //     "city": {
  //       "type": "object",
  //       "minItems": 1,
  //       "uniqueItems": true,
  //       "required": ["name", "url"],
  //       "properties": {
  //         "name": {
  //           "type": "string"
  //         },
  //         "url": {
  //           "type": "string"
  //         }
  //       },
  //       "items": {
  //         "type": "string"
  //       }
  //     },
  //     "airport": {
  //       "type": "object",
  //       "minItems": 1,
  //       "uniqueItems": true,
  //       "required": ["name", "url"],
  //       "properties": {
  //         "name": {
  //           "type": "string"
  //         },
  //         "url": {
  //           "type": "string"
  //         }
  //       },
  //       "items": {
  //         "type": "string"
  //       }
  //     }
  //   }
  // };

  beforeEach(function () {
    makrdown = md("<h2><span class=\"mw-headline\" " +
      "id=\"North_America\">North America</span><span " +
      "class=\"mw-editsection\"><span class=\"mw-editsection-bracket\">" +
      "[</span><a href=\"/w/index.php?title=AeroSur_destinations&amp;action=edit&amp;section=3\" " +
      "title=\"Edit section: North America\">edit</a><span " +
      "class=\"mw-editsection-bracket\">]</span></span></h2> <ul >" +
      " <li > <b > United States </b> <ul >" +
      "<li > <a href = \"/wiki/Miami\" title=\"Miami\">Miami</a> - " +
      "<a href=\"/wiki/Miami_International_Airport\" " +
      "title=\"Miami International Airport\">Miami International Airport</a>" +
      "</li> <li > <a href = \"/wiki/Washington,_D.C.\" " +
      "title=\"Washington, D.C.\">Washington, D.C.</a> - " +
      "<a href=\"/wiki/Washington_Dulles_International_Airport\" " +
      "title=\"Washington Dulles International Airport\">Washington Dulles" +
      " International Airport</a></li> </ul> </li> </ul>", {
        inline: true
      });
    // sjs.StaticScraper.create("./spec/models/Air Austral - Wikipedia, the free encyclopedia.html")
    //   .scrape(function ($) {
    //     makrdown = md($(".mw-content-ltr").html(), {
    //       inline: true
    //     });
    //   })
    //   .then();
    makrdownResults = getDestinations(makrdown);
  });

  it("Should be a function", function () {
    expect(getDestinations).to.be.a("function");
  });

  it("should return an Array", function () {
    expect(makrdownResults).to.be.an("array");
  });

  it("Shouldn't be an empty array", function () {
    // console.log(makrdownResults.length);
    expect(makrdownResults.length).to.be.above(1);
  });
});

describe("getLinkStrings function, it:", function () {
  var linkStringResult;

  beforeEach(function () {
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
