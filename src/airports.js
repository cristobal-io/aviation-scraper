"use strict";
var callScraper = require("./airline.js").callScraper;

var fs = require("fs");
var _ = require("lodash");
var async = require("async");
// json schema validation module
var Ajv = require("ajv");
var ajv = Ajv();
// log tools
var debug = require("debug")("aviation-data:airports");
var chalk = require("chalk");

var cleanDuplicates = require("../src/airline_destinations_pages.js").cleanDuplicates;

var BASE_URL = "https://en.wikipedia.org";
// this vars are used to log how many airports meet the airport schema and
// how many don't.
var airportsDataSaved = 0,
  airportsDataErrors = 0;

// function used to save data passed on the first argument at the location
// specified on the second argument.
var writeJson = function (airlines, fileName, callback) {
  fs.writeFile(fileName,
    JSON.stringify(airlines, null, 2),
    function (err) {
      callback(err);
    }
  );
};

// this method has the purpose to be used with the returned 
// value with all the destinations of all the companies.
// from all the destinations passed into a single file, gets all the airports
// and return them without duplicates.
function getAirports(airlines) {
  var airports = [];

  // gets from the airline the destinations and add all the airports to the 
  // airports array.
  function insertAirports(airlineDestinations) {
    return _.map(airlineDestinations.destinations, function (destination) {
      airports.push(destination.airport);
    });
  }
  _.map(airlines, function (airlineDestinations) {
    if (airlineDestinations.destinations.length) {
      insertAirports(airlineDestinations);
    }
  });
  // clean all the duplicated values we have for airports.
  airports = cleanDuplicates(airports);
  return airports;
}

function saveAirports(airports, fileName, callback) {
  writeJson(airports, fileName, function (err) {
    if (err) {
      console.log(err); //eslint-disable-line no-console
    }
    debug("saved %s", fileName);
    callback(err);
  });

}

function getAndSaveAirports(airlines, fileName, callback) {
  var airports = getAirports(airlines);

  saveAirports(airports, fileName, function (err) {
    callback(err, airports);
  });
}

// connect to the wikipage of the airport and gets the important data related to 
// coordinates and rwy
function getData(airportLink, callback) {
  var url = airportLink.url;

  debug("Getting data for %s from %s", airportLink.name, url);
  callScraper(url, "airports", function(err, airportData) {
    airportData.url = url;
    var fileName = getAirportFileName(airportData);

    writeJson(airportData, fileName, function (err) {
      debug("file %s saved", airportData.fileName);
      callback(err, airportData);
    });
    
  });
}

// checks the JSON schema and returns the same object passed with the filename 
// with airport_ if the schema is valid and with airport_error_
function getAirportFileName(airportData) {
  var defaultDataAirportSchema = require("../schema/airport_data.schema.json");
  var validateAirportData = ajv.compile(defaultDataAirportSchema);
  var validDefaultRoute = validateAirportData([airportData]),
    decodedUrl, name, fileName;

  if (validDefaultRoute) {
    decodedUrl = decodeURI(airportData.url);
    name = decodedUrl.split("/").pop();
    fileName = "./data/airport_" + name + ".json";
    airportsDataSaved += 1;
  } else {
    decodedUrl = decodeURI(airportData.url);
    name = decodedUrl.split("/").pop();
    fileName = "./data/airport_error_" + name + ".json";

    debug(chalk.red("Airline %s got the error %s"), fileName,
      _.get(validateAirportData, "errors[0].message"));
    airportsDataErrors += 1;
    airportData.errorMessage = "airport " + fileName + " got the error " +
      _.get(validateAirportData, "errors[0].message");
  }
  debug(chalk.green("%s airports Saved &") + chalk.red(" %s airports with errors."), airportsDataSaved, airportsDataErrors);
  return fileName;
}

// receives an array with all the airports to scrape and manages to call
// getData with each one of the airports.
// Returns an array with all the airports with all their data included.
function getAirportsData(airportsLink, callback) {
  async.mapLimit(airportsLink, 10, function (airportLink, callback) {
    var base = airportLink.base_url || BASE_URL;

    async.retry(5, function (callback) {
      getData({
        "name": airportLink.name,
        "url": base + airportLink.url
      }, callback);
    }, callback);

  }, function (err, airportsData) {
    callback(err, airportsData);
  });

}
module.exports = {
  getAirports: getAirports,
  writeJson: writeJson,
  getAirportsData: getAirportsData,
  getData: getData,
  getAirportFileName: getAirportFileName,
  getAndSaveAirports: getAndSaveAirports
};
