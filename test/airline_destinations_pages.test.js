"use strict";

// Mocha
var chai = require("chai");
var expect = chai.expect;

var _ = require("lodash");

var airlineDestinations = require("../src/airline_destinations_pages.js");
var getAllDestinationsPages = airlineDestinations.getAllDestinationsPages;
var getAllLinks = airlineDestinations.getAllLinks;
var cleanDuplicates = airlineDestinations.cleanDuplicates;

// constants
var BASE_URL = "http://localhost";
var PORT = 3000;
var SERVER_LISTENING = BASE_URL + ":" + PORT;
var BASE_DIR = "./data";


var Ajv = require("ajv");
var ajv = Ajv();

describe("airline_destinations_pages.js: \n", function () {
  var destinations_results, destination_url = {};

  var validateDestPagSchema;


  before(function (done) {

    var destinationsPagesSchema = require("../schema/airline_destinations.schema.json");
    var destinationsPages = require("../test/fixtures/airline_destination_pages_links.json"),
      i;
    var url = [];

    validateDestPagSchema = ajv.compile(destinationsPagesSchema);
    for (i = 0; i < destinationsPages.length; i += 1) {
      url.push(SERVER_LISTENING + "/" + destinationsPages[i]);
    }

    destination_url = {
      urls: url,
      destinationsFile: __dirname + "/spec/local_pages/destinations.json",
      baseDir: BASE_DIR
    };
    getAllDestinationsPages(destination_url, function (err, results) {
      destinations_results = results;
      done();
    });
  });

  describe("function getAllLinks ", function() {

    it("Should return the list of links", function (done) {
      getAllLinks({
        urls: destination_url.urls[0],
        destinationsFile: destination_url.destinationsFile
      }, function (err, data) {
        var letters = _.reduce(data, function (letters, url) {
          return letters + url.substr(url.length - 1);
        }, "");

        expect(letters).to.eql("0ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        done();
      });
    });

  });

  describe("function cleanDuplicates ", function () {

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

  describe("function getAllDestinationsPages ", function () {

    it("Should meet the schema for airline destinations", function (done) {
      var validDestPagSchema = validateDestPagSchema(destinations_results);

      if (!validDestPagSchema) {
        console.log(validateDestPagSchema.errors); // eslint-disable-line no-console
      }
      expect(validDestPagSchema).to.be.true;
      done();
    });


    it("should not have duplicates on results", function (done) {
      _.map(_.groupBy(destinations_results, function (value) {
        return value.name;
      }), function (grouped) {
        expect(grouped).to.have.length(1);
      });
      done();
    });
  });

});
