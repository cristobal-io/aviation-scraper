"use strict";
var airports = require("../tmp/airports.json");
var fs = require("fs");

var missingCoordinatesAirports = airports.reduce(function(result, airport) {
  if (!airport.data.coordinates.latitude || !airport.data.coordinates.longitude) {
    // console.log(airport);
    result.push(airport);
  }
  return result;
}, []);
var fileName = "./tmp/missing_coordinates_airports.json";

fs.writeFile(fileName, JSON.stringify(missingCoordinatesAirports,null, 2), function() {
  console.log( "we have", missingCoordinatesAirports.length, "airports without coordinates");
  console.log("the file", fileName, "has been saved");
});
