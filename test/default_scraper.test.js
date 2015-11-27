"use strict";
var defaultScraper = require("../scrapers/default.js");
var getDestination = defaultScraper.getDestination;
var getDestinations = defaultScraper.getDestinations;
var getLinkStrings = defaultScraper.getLinkStrings;
var hasValidLinks = defaultScraper.hasValidLinks;
var getLinkInfo = defaultScraper.getLinkInfo;

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

describe("hasValidLinks function, it:", function () {
  var link, hasValidLinksResult;

  beforeEach(function () {
    link = [
      [
        "[Madrid](/wiki/Madrid \"Madrid\")",
        "Madrid",
        "/wiki/Madrid"
      ],
      [
        "[Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")",
        "Madrid Barajas Airport",
        "/wiki/Madrid_Barajas_Airport"
      ]
    ];
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
    var link_0_1_false = [
      [
        "[Madrid](/wiki/Madrid \"Madrid\")",
        "",
        "/wiki/Madrid"
      ],
      [
        "[Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")",
        "Madrid Barajas Airport",
        "/wiki/Madrid_Barajas_Airport"
      ]
    ];
    var link_0_2_false = [
      [
        "[Madrid](/wiki/Madrid \"Madrid\")",
        "Madrid",
        ""
      ],
      [
        "[Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")",
        "Madrid Barajas Airport",
        "/wiki/Madrid_Barajas_Airport"
      ]
    ];
    var link_1_1_false = [
      [
        "[Madrid](/wiki/Madrid \"Madrid\")",
        "Madrid",
        "/wiki/Madrid"
      ],
      [
        "[Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")",
        "",
        "/wiki/Madrid_Barajas_Airport"
      ]
    ];
    var link_1_2_false = [
      [
        "[Madrid](/wiki/Madrid \"Madrid\")",
        "Madrid",
        "/wiki/Madrid"
      ],
      [
        "[Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")",
        "Madrid Barajas Airport",
        ""
      ]
    ];

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

  it("Should return an array", function() {
    expect(getLinkInfo(line)).to.be.an("array");
  });

  it("Should return a length of 3", function() {
    expect(getLinkInfo(line).length).to.be.above(2);
  });
  it("Should match the returned values", function() {
    var getLinkInfoResult = getLinkInfo(line);
    var re = "\\[([^\\[]+)\\]\\(([^\\)]+)\\)";
    var linksInfoRe = new RegExp(re);

    expect(getLinkInfoResult[0]).to.match(linksInfoRe);
    expect(getLinkInfoResult[2]).to.match(/^\/wiki\/\w*/);
    expect(getLinkInfoResult[2]).not.to.match(/\/wiki\/\w*\s+"\w+"$/);

  });

});
