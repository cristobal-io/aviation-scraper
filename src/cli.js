"use strict";

var airlineScrapers = require("./index.js");
var debug = require("debug")("airlineData:cli");


/**
 * airline destinations 
 */

var getAllDestinations = airlineScrapers.getAllDestinations;
var getScraperTypeForAll = airlineScrapers.getScraperTypeForAll;
var getAllRoutes = airlineScrapers.getAllRoutes;
var getAirports = airlineScrapers.getAirports;
var writeJson = airlineScrapers.writeJson;


var options = {
  "urls": "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations",
  "destinationsFile": "./data/destination_pages.json"
};

getAllDestinations(options, function (err, airlines) {
  if (err) {
    throw err;
  }

  console.log("Destinations File Created"); // eslint-disable-line no-console

  getScraperTypeForAll({
    "airlines": airlines
  }, function (err, airlineScrapers) {
    if (err) {
      throw err;
    }

    console.log("scrapers finished"); // eslint-disable-line no-console

    getAllRoutes(airlineScrapers, function (err, airlines) {
      if (err) {
        throw err;
      }
      debug("Routes Files Generated");

      writeJson(airlines, "data/airlines_destinations.json", function () {
        getAirports(airlines, "data/airports.json");
      });
    });

  });
});
