"use strict";
var fs = require("fs");

var airportsList = require("../tmp/airports_list.json");
var airports = require("../tmp/airports.json");
var airportStats = airports.reduce(function(result, airport) { // eslint-disable-line complexity
  var data = airport.data;

  result.counter += 1;
  if (data.coordinates && data.coordinates.latitude && data.coordinates.longitude){
    result.coordinates += 1;
  } 
  if (data.runway.length > 0) {
    result.runway += 1;
  }
  if (data.name) {
    result.name += 1;
  }
  if (data.nickname) {
    result.nickname += 1;
  }
  if (data.iata) {
    result.iata += 1;
  }
  if (data.icao) {
    result.icao += 1;
  }

  return result;
}, {
  coordinates: 0,
  runway: 0,
  counter: 0,
  name: 0,
  nickname: 0,
  iata: 0,
  icao: 0
});

airportStats.links = airportsList.length;

var fileName = "./tmp/airport_stats.json";

fs.writeFile(fileName, JSON.stringify(airportStats, null, 2), function() {
  console.log( "we have", airportsList.length, "airports, here is the data", JSON.stringify(airportStats, null, 2));
  console.log("the file", fileName, "has been saved");
});
