"use strict";

var source = require("./index.js");
var debug = require("debug")("airlineData:cli");


/**
 * airline destinations 
 */

var writeJson = source.writeJson;
// var getAllDestinations = source.getAllDestinations;
// var getScraperTypeForAll = source.getScraperTypeForAll;
// var getAllRoutes = source.getAllRoutes;
// var getAirports = source.getAirports;
// var getAirportsData = source.getAirportsData;
var getAllAirportsByIata = source.getAllAirportsByIata;
var splitGetAirportsData = source.splitGetAirportsData;


// var options = {
//   "urls": "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations",
//   "destinationsFile": "./data/destination_pages.json"
// };

// getAllDestinations(options, function (err, airlines) {
//   if (err) {
//     throw err;
//   }

//   debug("Destinations File Created");

//   getScraperTypeForAll({
//     "airlines": airlines
//   }, function (err, airlineScrapers) {
//     if (err) {
//       throw err;
//     }

//     debug("scrapers finished");

//     getAllRoutes(airlineScrapers, function (err, airlines) {
//       if (err) {
//         throw err;
//       }
//       debug("Routes Files Generated");

//       /**
//        * getAirports links and data
//        */

//       getAllAirportsByIata("", function (err, airportsData) {
//         writeJson(airportsData, "./data/airports_list.json", function () {
//           debug("airports_list saved");
//         });
//         getAirportsData(airportsData, function () {
//           debug("Saved all the data airports");
//         });
//       });

//       debug(airlines);
//       // writeJson(airlines, "data/airlines_destinations.json", function () {
//       //   getAirports(airlines, "data/airports.json");
//       // });
//     });

//   });
// });

getAllAirportsByIata("", function (err, airportsData) {
  writeJson(airportsData, "./data/airports_list.json", function () {
    debug("airports_list saved");
  });
  splitGetAirportsData(airportsData, function () {
    debug("Saved all the data airports");
  });
});
