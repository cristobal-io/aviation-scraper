"use strict";

// Mocha
var chai = require("chai");
var expect = chai.expect;

var _ = require("lodash");

var airlinesIndex = require("../src/index.js");
var getAllDestinations = airlinesIndex.getAllDestinations;
var getDestinations = airlinesIndex.getDestinations;
var getAllLinks = airlinesIndex.getAllLinks;

// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;

describe.only("Airline_destinations.js: \n", function() {
  var destinations_results,destination_url = {};

  before(function (done) {
    var url = SERVER_LISTENING + "/Lists_of_airline_destinations.html";

    // console.log(url);

    destination_url = {
      urls: url,
      destinationsFile: __dirname + "/spec/models/destinations.json"
    };
    // console.log(destination_url);
    getAllDestinations(destination_url,function (err, results) {
      destinations_results = results;
      done();
    });
    // done();
  });

  describe("getAllDestinations", function() {
    
    it("Should be a function 'getAllDestinations'", function () {
      expect(getAllDestinations).to.be.a("function");
    });

    it("getAllDestinations return an Array", function() {
      expect(destinations_results).to.be.an("array");
    });

  });

  describe("getDestinations", function() {
    
    it("Should be a function 'getDestinations'", function () {
      expect(getDestinations).to.be.a("function");
    });

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

  it("Should return the list of links", function (done) {
    getAllLinks(destination_url, function (err, data) {
      var letters = [];

      _.map(data, function (url) {
        letters.push(url.substr(url.length-1));
      });
      expect(letters).to.eql("0ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
      // Bermi: do you think this is the right way of test this?
      done();
    });

  });

});
