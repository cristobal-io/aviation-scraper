"use strict";

var airlineScrapers = require("./index.js");

/**
 * airline destinations 
 */

var getAllDestinations = airlineScrapers.getAllDestinations;
var getScraperTypeForAll = airlineScrapers.getScraperTypeForAll;
var getAllRoutes = airlineScrapers.getAllRoutes;

var options = {
  "urls": "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations",
  "destinationsFile": "./data/destination_pages.json"
};

getAllDestinations(options, function (err, airlines) {
  if (err) {throw err;}

  console.log("Destinations File Created"); // eslint-disable-line no-console

  getScraperTypeForAll({"airlines": airlines}, function (err, airlineScrapers) {
    if (err) {throw err;}

    console.log("scrapers finished");

    getAllRoutes(airlineScrapers, function (err) {
      if (err) {throw err;}
      console.log("Routes Files Generated");
    });

  });
});
