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

    console.log("scrapers finished");// eslint-disable-line no-console

    getAllRoutes(airlineScrapers, function (err, airlines) {
      if (err) {throw err;}
      console.log("Routes Files Generated");// eslint-disable-line no-console

      writeJson(airlines, "data/airlines_destinations.json");
      getAirports(airlines);

    });

  });
});

var fs = require("fs");

var writeJson = function (airlines, fileName) {
  
  
  fs.writeFile(fileName,
    JSON.stringify(airlines, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      console.log("saved %s file", fileName);
    }
  );
};


var _ = require("lodash");
var airports = [];
// var jsonAirline = require("./airlines.json");

function getAirports(airlines) {
  _.map(airlines, function (value) {
    _.forEach(value.routes, function (value) {
      airports.push(value.airport);
    });
  });
  // airports = _.orderBy(airports, "name");
  writeJson(airports, "data/airports.json");
}

