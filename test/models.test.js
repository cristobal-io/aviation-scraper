"use strict";
// Mocha
var chai = require("chai");
var expect = chai.expect;

// scraper
var sjs = require("scraperjs");
// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;

var airlinesIndex = require("../src/index.js");
var getRoutes = airlinesIndex.getRoutes;
var getAllRoutes = airlinesIndex.getAllRoutes;

var getAllDestinations = airlinesIndex.getAllDestinations;
var getDestinations = airlinesIndex.getDestinations;


describe("does the server works outside the suite?", function () {

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

  it("Should have the schema for destinations", function (done) {
    var destinationsSchema = {
      "title": "destination pages schema v1",
      "type": "object",
      "required": ["name", "destinationsLink"],
      "properties": {
        "name": {
          "type": "string",
          "minItems": 1,
          "uniqueItems": true
        },
        "destinationsLink": {
          "type": "string"
        }
      }
    };

    for (var i = 0; i < destinations_results.length; i += 1) {
      expect(destinations_results[i]).to.be.jsonSchema(destinationsSchema);
    }
    done();

  });

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

