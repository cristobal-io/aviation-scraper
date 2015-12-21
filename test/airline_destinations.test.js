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

var Ajv = require("ajv");
var ajv = Ajv();

describe("Airline_destinations.js: \n", function() {
  var destinations_results,destination_url = {};

  var validateDestPagSchema;


  before(function (done) {
  
    var destinationsPagesSchema = require("../schema/airline_destinations.schema.json");

    validateDestPagSchema = ajv.compile(destinationsPagesSchema);
  
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

  it("Should meet the schema for airline destinations", function (done) {

    var validDestPagSchema = validateDestPagSchema(destinations_results);

    if (!validDestPagSchema) {
      console.log(validateDestPagSchema.errors);// eslint-disable-line no-console
    }
    expect(validDestPagSchema).to.be.true;
    done();
  });

  it("Should return the list of links", function (done) {
    getAllLinks(destination_url, function (err, data) {
      var letters = _.reduce(data, function (letters, url) {
        return letters + url.substr(url.length-1);
      }, "");

      expect(letters).to.eql("0ABCDEFGHIJKLMNOPQRSTUVWXYZ");
      done();
    });

  });

});
