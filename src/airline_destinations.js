"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var scrapers = require("../scrapers/");
var async = require("async");

var BASE_URL = "https://en.wikipedia.org";

var _ = require("lodash");

var Ajv = require("ajv");
var ajv = Ajv();

var chalk = require("chalk");
var debug = require("debug")("airlineData:destinations");

var errors = 0,
  destinationsSaved = 0;

/**
 * calls the scraper specified and retrieves the destinations for the airline.
 * @param  {object}   airline  contains the information for the airline we 
 * need to obtain the destinations.
 * @param  {Function} callback the returning function that is going to be passed
 * to the next function.
 * @return {object}            all the destinations.
 */
function getDestinations(airline, callback) {
  var url = airline.url || BASE_URL + airline.destinationsLink;

  debug("Getting destinations for %s from %s", airline.name, url);
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        debug(chalk.red("\nerror from %s is %s, %s \n"), airline.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers[airline.scraper] || scrapers["default"])
    .then(function (data) {
      airline.destinations = data;
      checkAndSaveDestinations(null, airline, callback);
    });
}
/**
 * checks the schema integrity and returns the object airline with the fileName
 * starting with destinations_ if the schema is valid or error_ if don't.
 * @param  {object} airline contains all the relevant parameters to the airline 
 * we are scraping at that moment.
 * @return {object}         airline with the fileName path.
 */
function getFilename(airline) {
  var defaultRoute = require("../schema/scraper.default.schema.json");
  var validateDefaultRoute = ajv.compile(defaultRoute);
  var validDefaultRoute = validateDefaultRoute(airline.destinations);

  if (validDefaultRoute) {
    destinationsSaved += 1;
    airline.fileName = "./data/destinations_" + airline.name + ".json";
  } else {
    debug("Airline %s got the error %s", airline.name,
      _.get(validateDefaultRoute, "errors[0].message"));
    errors += 1;
    airline.fileName = "./data/error_" + airline.name + ".json";
    airline.errorMessage = "Airline " + airline.name + " got the error " +
      _.get(validateDefaultRoute, "errors[0].message");
  }
  return airline;
}
/**
 * checks the schema and saves the JSON file 
 * @param  {object}   airline  contains all the information to the unique airline 
 * we are scrapping at the moment.
 * @return {object}            airline with fileName added.
 */
var checkAndSaveDestinations = function (err, airline, callback) {
  if (err) {
    throw err;
  }
  airline = getFilename(airline);
  var errorRegEx = /error/;

  fs.writeFile(airline.fileName,
    JSON.stringify(airline.destinations, null, 2),
    function (err) {
      if (err) {
        throw err;
      }
      if (errorRegEx.test(airline.fileName)) {
        debug(chalk.red("Saved %s"), airline.fileName);
      } else {
        debug(chalk.green("Saved %s"), airline.fileName);
      }
      callback(null, airline);
    }
  );
};

/**
 * scrapes one by one each airline link in batches specified by mapLimit
 * @param  {array}   airlines contains all the airlines we are going to retrieve
 *  the destinations.
 * @param  {Function} callback returns with err and airlines data. 
 * @return {array}            all the airlines requested with the destinations, errors log and count..
 */
function getAllDestinations(airlines, callback) {
  async.mapLimit(_.clone(airlines, true), 20, function (airline, callback) {

    async.retry(5, function (callback) {
      getDestinations(airline, callback);
    }, callback);

  }, function (err, airlines) {
    if (err) {
      console.log(chalk.red.bgWhite("\ngetAllDestinations found an error %s"), err); // eslint-disable-line no-console
    }
    airlines.destinationsSaved = destinationsSaved;
    airlines.errors = errors;
    debug("You got %s destinations and %s errors", destinationsSaved, errors);
    callback(err, airlines);

  });
}

module.exports = {
  getDestinations: getDestinations,
  getAllDestinations: getAllDestinations,
  getFilename: getFilename
};
