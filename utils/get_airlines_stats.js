"use strict";
var fs = require("fs");
var debug = require("debug")("aviation-scraper:stats");
var chalk = require("chalk");

var airlinesLinks = require("../tmp/airlines_links.json");
var airlinesLinksStats = airlinesLinks.reduce(function(result, airline) { // eslint-disable-line complexity
  result.counter += 1;
  if (airline.airline.link){
    result.link += 1;
  } 
  if (airline.ICAO) {
    result.ICAO += 1;
  }
  if (airline.IATA) {
    result.IATA += 1;
  }
  if (airline.CallSign) {
    result.CallSign += 1;
  }
  if (airline.Country) {
    result.Country += 1;
  }
  if (airline.airline.name) {
    result.name += 1;
  }

  return result;
}, {
  counter: 0,
  link: 0,
  ICAO: 0,
  IATA: 0,
  CallSign: 0,
  Country: 0,
  name: 0

});
var airlinesLinksFile = "./tmp/airlines_links_stats.json";

fs.writeFile(airlinesLinksFile, JSON.stringify(airlinesLinksStats,null, 2), function() {
  debug(chalk.green("------------------------------------------------------------------------------"));
  debug(chalk.green("Airlines Links Stats:"));
  debug( "we have " + chalk.yellow(airlinesLinksStats.counter) + " airlines links listed");
  debug("Here the numbers");
  debug(airlinesLinksStats);
  debug("the file " + chalk.cyan(airlinesLinksFile) + " has been saved");
});

var airlinesData = require("../tmp/airlines_data.json");
var airlinesDataStats = airlinesData.reduce(function(result, airline) { // eslint-disable-line complexity
  result.counter += 1;
  if (airline.url) {
    result.url += 1;
  }
  if (airline.name) {
    result.name += 1;
  }
  if (airline.logoLink) {
    result.logoLink += 1;
  }
  if (airline.ICAO) {
    result.ICAO += 1;
  }
  if (airline.IATA) {
    result.IATA += 1;
  }
  if (airline.CallSign) {
    result.CallSign += 1;
  }
  if (airline.hubs && airline.hubs.length > 0) {
    result.hubs += 1;
  }
  if (airline.OperatingBases && airline.OperatingBases.length > 0) {
    result.OperatingBases += 1;
  }
  if (airline.website) {
    result.website += 1;
  }

  return result;
}, {
  counter: 0,
  url: 0,
  name: 0,
  logoLink: 0,
  IATA: 0,
  ICAO: 0,
  Callsign: 0,
  hubs: 0,
  OperatingBases: 0,
  website: 0
});
var airlinesDataFile = "./tmp/airlines_data_stats.json";

fs.writeFile(airlinesDataFile, JSON.stringify(airlinesDataStats,null, 2), function() {
  debug(chalk.green("------------------------------------------------------------------------------"));
  debug(chalk.green("Airlines Data Stats:"));
  debug( "we have data for " + chalk.yellow(airlinesDataStats.counter) + " airlines, so we are missing detailed data from " + chalk.red(airlinesLinksStats.counter - airlinesDataStats.counter));
  debug("Here the numbers");
  debug(airlinesDataStats);
  debug("the file " + chalk.cyan(airlinesDataFile) + " has been saved");
});
