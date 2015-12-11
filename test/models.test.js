"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;
// server
var express = require("express");
var serveStatic = require("serve-static");
var app = express();
// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var MODELS_DIR = "/spec/models/";
var SERVER_LISTENING = BASE_URL + ":" + PORT;

var airlinesIndex = require("../src/index.js");
var getRoutes = airlinesIndex.getRoutes;
var getAllRoutes = airlinesIndex.getAllRoutes;
var getScraperType = airlinesIndex.getScraperType;
var getScraperTypeForAll = airlinesIndex.getScraperTypeForAll;
var getAllDestinations = airlinesIndex.getAllDestinations;
var getDestinations = airlinesIndex.getDestinations;


before("start server", function (done) {
  app.use(serveStatic(__dirname + MODELS_DIR));
  isPortTaken(PORT, function (err, data) {
    if (!data) {
      app.listen(PORT);
    }
    done();
  });
});


describe("Server is on", function () {

  it("Confirm scraper is working with index.html", function () {
    sjs.StaticScraper.create(SERVER_LISTENING)
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("Models");
      });
  });

  it("Check the page AeroSur_destinations is on", function () {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("h1").text();
      })
      .then(function (data) {
        expect(data).to.eql("AeroSur destinations");
      });
  });

});


describe("does it works outside the suite?", function () {

  it("Should get the siteSub id value", function () {
    sjs.StaticScraper.create(SERVER_LISTENING + "/AeroSur_destinations.html")
      .scrape(function ($) {
        return $("#siteSub").text();
      })
      .then(function (data) {
        expect(data).to.eql("From Wikipedia, the free encyclopedia");
      });
  });

});

var options = [{
  name: "default",
  destinationsLink: "/AeroSur_destinations.html",
  url: SERVER_LISTENING + "/AeroSur_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "default",
    destinationsLink: "/AeroSur_destinations.html",
    url: SERVER_LISTENING + "/AeroSur_destinations.html"
  }]
}, {
  name: "table_with_origins",
  destinationsLink: "/Adria_Airways_destinations.html",
  url: SERVER_LISTENING + "/Adria_Airways_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "table_with_origins",
    destinationsLink: "/Adria_Airways_destinations.html",
    url: SERVER_LISTENING + "/Adria_Airways_destinations.html"
  }]

}, {
  name: "table",
  destinationsLink: "/Aegean_Airlines_destinations.html",
  url: SERVER_LISTENING + "/Aegean_Airlines_destinations.html",
  destinationsFile: "./test/spec/data/destination_pages.json",
  airlines: [{
    name: "table",
    destinationsLink: "/Aegean_Airlines_destinations.html",
    url: SERVER_LISTENING + "/Aegean_Airlines_destinations.html"
  }, {
    name: "table_with_origins",
    destinationsLink: "/Adria_Airways_destinations.html",
    url: SERVER_LISTENING + "/Adria_Airways_destinations.html"
  }]

}];


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
    // BERMI: no way to get this from json, not working

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


describe("Airline Destinations, it:", function() {
  var destinations_results;

  before(function (done) {
    var destination_url = {
      url: [SERVER_LISTENING + "/Category:Lists_of_airline_destinations.html"],
      destinationsFile: __dirname + "/spec/models/destinations.json"
    };

    getAllDestinations(destination_url,function (err, results) {
      destinations_results = results;
      done();
    });
    
  });

  it("Should be a function 'getAllDestinations'", function () {
    expect(getAllDestinations).to.be.a("function");
  });

  it("Should be a function 'getDestinations'", function () {
    expect(getDestinations).to.be.a("function");
  });

  it("getAllDestinations return an Array", function() {
    expect(destinations_results).to.be.an("array");
  });

// TODO: check schema integrity of returned array

});

describe("getRoutes function", function () {

  it("Should be a function", function () {
    expect(getRoutes).to.be.a("function");
  });

});


describe("getAllRoutes function", function () {

  it("Should be a function", function () {
    expect(getAllRoutes).to.be.a("function");
  });

});

function isPortTaken(port, fn) {
  var net = require("net");
  var tester = net.createServer()
    .once("error", function (err) {
      if (err.code != "EADDRINUSE") {
        return fn(err);
      }
      fn(null, true);
    })
    .once("listening", function () {
      tester.once("close", function () {
        fn(null, false);
      })
        .close();
    })
    .listen(port);

}
