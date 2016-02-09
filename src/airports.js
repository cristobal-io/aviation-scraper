"use strict";
var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");

var fs = require("fs");
var _ = require("lodash");

var chalk = require("chalk");
var async = require("async");

var debug = require("debug")("airlineData:airports");

var cleanDuplicates = require("../src/airline_destinations.js").cleanDuplicates;

var BASE_URL = "https://en.wikipedia.org";


var writeJson = function (airlines, fileName, callback) {
  fs.writeFile(fileName,
    JSON.stringify(airlines, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      callback();
    }
  );
};

function getAirports(airlines, fileName) {
  var airports = [];

  function insertAirports(airlineDestinations) {
    return _.map(airlineDestinations.routes, function (destination) {
      airports.push(destination.airport);
    });
  }
  _.map(airlines, function (airlineDestinations) {
    if (airlineDestinations.routes.length) {
      insertAirports(airlineDestinations);
    }
  });
  airports = cleanDuplicates(airports);
  // Bermi I've added this "if" so if no filename is passed, doesn't cause
  // problems, I guess that is not the best way of doing it and I should
  // rewrite the getAirports function with a callback.
  // 
  // I think the right thing to do is to write it with a callback.
  // 
  // callback(err, airports);
  // 
  // And when using the callback, apply the writeJson function
  // 
  if (fileName) {
    writeJson(airports, fileName, function () {
      debug("saved %s", fileName);
    });
  }
  // Bermi I've added return so I can test the function.
  // I have some doubts about how to test a function if it doesn't have a 
  // callback or returns something.
  return airports;
}

function getData(airportLink, callback) {
  BASE_URL = airportLink.base_url || BASE_URL;
  var url = BASE_URL + airportLink.url;

  debug("Getting data for %s from %s", airportLink.name, url);
  scraperjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        console.log(chalk.red("\nerror from %s is %s, %s \n"), airportLink.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers["airports"])
    .then(function (airportData) {
      airportData.url = url;
      // bermi, shoul I add a call to writeJson 
      // so I save each airport into a file?
      callback(null, airportData);
    });
}

function getAirportData(airportsLink, callback) {

  async.mapLimit(airportsLink, 10, function (airportLink, callback) {
    async.retry(5, function (callback) {
      getData(airportLink, callback);
    }, callback);


  }, function (err, airportsData) {
    callback(err, airportsData);
  });

}

module.exports.getAirports = getAirports;
module.exports.writeJson = writeJson;
module.exports.getAirportData = getAirportData;
