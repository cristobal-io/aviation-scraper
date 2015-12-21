"use strict";

var airlineScrapers = require("./index.js");

/**
 * airline destinations 
 */

var getAllDestinations = airlineScrapers.getAllDestinations;


var options = {
  "urls" : "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations",
  "destinationsFile" : "./data/destination_pages.json"
};

getAllDestinations(options, function () {
  console.log("Destinations File Created");// eslint-disable-line no-console
});
