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
      // if (err) {
      //   throw err;
      // }
      callback(err);
    }
  );
};

// this method has the purpose to be used with the returned 
// value with all the destinations of all the companies.
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
    writeJson(airports, fileName, function (err) {
      if (err) {
        console.log(err);
      }
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
        debug(chalk.red("\nerror from %s is %s, %s \n"), airportLink.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers["airports"])
    .then(function (airportData) {
      airportData.url = url;
      // Bermi, should I add a call to writeJson 
      // so I save each airport into a file?
      // var decodedUrl = decodeURI(airportData.url);
      // var name = decodedUrl.split("/").pop();
      // var fileName = "./data/airport_" + name + ".json";
      getAirportFileName(airportData);

      // this way of calling writeJson has sideefects when testing that are
      // not taken care of, the files generated are not deleted.
      writeJson(airportData, airportData.fileName, function (err) {
        debug("file %s saved", airportData.fileName);
        callback(err, airportData);
      });
    });
}
var airportsDataSaved = 0,
  airportsDataErrors = 0;
var Ajv = require("ajv");
var ajv = Ajv();

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
  // Bermi, I was having problem with "process out of memory"
  // so I decided to switch the method to each. More than 6.500 airports
  // todo: fix the test since the callback doesn't return data, only err.
  // both methods give the same rror "process out of memory" 
  // with around (5885 mapLimit) (5850 eachLimit) airports saved

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
module.exports.getAirportsData = getAirportsData;
module.exports.getData = getData;
