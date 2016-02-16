"use strict";
var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");

var fs = require("fs");
var _ = require("lodash");
var async = require("async");
// json schema validation module
var Ajv = require("ajv");
var ajv = Ajv();
// log tools
var debug = require("debug")("airlineData:airports");
var chalk = require("chalk");


var cleanDuplicates = require("../src/airline_destinations_pages.js").cleanDuplicates;

var BASE_URL = "https://en.wikipedia.org";

var airportsDataSaved = 0,
  airportsDataErrors = 0;

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
function getAirports(airlines) {
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
  return airports;
}

function saveAirports(airports, fileName, callback) {
  writeJson(airports, fileName, function (err) {
    if (err) {
      console.log(err);
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

function getData(airportLink, callback) {
  // var base = airportLink.base_url || BASE_URL;
  var url = airportLink.url;

  debug("Getting data for %s from %s", airportLink.name, url);
  scraperjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        debug(chalk.red("\nerror from %s is %s, %s \n"), airportLink.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers["airports"])
    .then(function (airportData) {
      airportData.url = url;
      getAirportFileName(airportData);

      // this way of calling writeJson has sideefects when testing that are
      // not taken care of, the files generated are not deleted.
      writeJson(airportData, airportData.fileName, function (err) {
        debug("file %s saved", airportData.fileName);
        callback(err, airportData);
      });
    });
}

function getAirportFileName(airportData) {
  var defaultDataAirportSchema = require("../schema/airport_data.schema.json");
  var validateAirportData = ajv.compile(defaultDataAirportSchema);
  var validDefaultRoute = validateAirportData([airportData]),
    decodedUrl, name;

  if (validDefaultRoute) {
    decodedUrl = decodeURI(airportData.url);
    name = decodedUrl.split("/").pop();
    airportData.fileName = "./data/airport_" + name + ".json";

    airportsDataSaved += 1;
  } else {
    decodedUrl = decodeURI(airportData.url);
    name = decodedUrl.split("/").pop();
    airportData.fileName = "./data/airport_error_" + name + ".json";

    debug(chalk.red("Airline %s got the error %s"), airportData.fileName,
      _.get(validateAirportData, "errors[0].message"));
    airportsDataErrors += 1;
    airportData.errorMessage = "airport " + airportData.fileName + " got the error " +
      _.get(validateAirportData, "errors[0].message");
  }
  debug(chalk.green("%s airports Saved &") + chalk.red(" %s airports with errors."), airportsDataSaved, airportsDataErrors);
  return airportData;
}

function getAirportsData(airportsLink, callback) {
  async.mapLimit(airportsLink, 30, function (airportLink, callback) {
    var base = airportLink.base_url || BASE_URL;
    // airportLink.url = base + airportLink.url

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
