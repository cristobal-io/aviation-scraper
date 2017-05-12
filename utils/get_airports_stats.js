"use strict";
var fs = require("fs");
var debug = require("debug")("aviation-scraper:stats");
var chalk = require("chalk");

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

airportStats.airports_listed = airportsList.length;

var fileName = "./tmp/airports_stats.json";

fs.writeFile(fileName, JSON.stringify(airportStats, null, 2), function() {
  debug(chalk.green("------------------------------------------------------------------------------"));
  debug(chalk.green("Airports Stats:"));
  debug( "we have " + chalk.yellow(airportsList.length) + " airports, here is the data");
  debug(airportStats);
  debug("we are missing data from " + chalk.red(airportStats.airports_listed - airportStats.counter) + " airports");
  debug("we dont have coordinates for " + chalk.red(airportStats.airports_listed - airportStats.coordinates) + " airports");
  debug("the file " + chalk.cyan(fileName) + " has been saved");
});
