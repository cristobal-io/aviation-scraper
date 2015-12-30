"use strict";

var airlineScrapers = require("./index.js");

/**
 * airline destinations 
 */

var getAllDestinations = airlineScrapers.getAllDestinations;
var getScraperTypeForAll = airlineScrapers.getScraperTypeForAll;

var options = {
  "urls" : "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations",
  "destinationsFile" : "./data/destination_pages.json"
};

getAllDestinations(options, function (err, airlines) {
  console.log("Destinations File Created");// eslint-disable-line no-console
  
  getScraperTypeForAll({"airlines": airlines}, function () {
    console.log("scrapers finished");
  });
});
