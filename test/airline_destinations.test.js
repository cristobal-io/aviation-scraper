"use strict";

// Mocha
var chai = require("chai");
var expect = chai.expect;

var _ = require("lodash");

var airlinesIndex = require("../src/index.js");
var getAllDestinations = airlinesIndex.getAllDestinations;
var getAllLinks = airlinesIndex.getAllLinks;
var cleanDuplicates = airlinesIndex.cleanDuplicates;

// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;

var Ajv = require("ajv");
var ajv = Ajv();

describe("Airline_destinations.js: \n", function () {
  var destinations_results, destination_url = {};

  var validateDestPagSchema;


  before(function (done) {

    var destinationsPagesSchema = require("../schema/airline_destinations.schema.json");

    validateDestPagSchema = ajv.compile(destinationsPagesSchema);

    var url = SERVER_LISTENING + "/Lists_of_airline_destinations";

    destination_url = {
      urls: url,
      destinationsFile: __dirname + "/spec/local_pages/destinations.json"
    };
    getAllDestinations(destination_url, function (err, results) {
      destinations_results = results;
      done();
    });
  });

  describe("getAllDestinations", function () {

    it("Should meet the schema for airline destinations", function (done) {
      var validDestPagSchema = validateDestPagSchema(destinations_results);

      if (!validDestPagSchema) {
        console.log(validateDestPagSchema.errors); // eslint-disable-line no-console
      }
      expect(validDestPagSchema).to.be.true;
      done();
    });

    it("Should return the list of links", function (done) {
      getAllLinks(destination_url, function (err, data) {
        var letters = _.reduce(data, function (letters, url) {
          return letters + url.substr(url.length - 1);
        }, "");

        expect(letters).to.eql("0ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        done();
      });
    });

    it("should not have duplicates on results", function (done) {
      var duplicateObject = require("./fixtures/duplicateObject.json");
      var objectClean = cleanDuplicates(duplicateObject);

      _.map(_.groupBy(objectClean, function (value) {
        return value.name;
      }), function (grouped) {
        expect(grouped).to.have.length(1);
      });
      done();
    });

  });

});
