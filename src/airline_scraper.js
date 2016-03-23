"use strict";

var fs = require("fs");
var async = require("async");
var _ = require("lodash");
var debug = require("debug")("aviation-scraper:scrapers");

var callScraper = require("./airline.js").callScraper;

var BASE_URL = "https://en.wikipedia.org";

// connect to the airline page and check the scraper we are going to use.
function getScraperType(options, callback) {
  var url = options.url || BASE_URL + options.destinationsLink;

  debug("Getting scraper for %s from %s", options.name, url);
  callScraper(url, "type_of_scrapper", function (err, type) {
    debug("found %s from %s", type, url);
    callback(null, {
      type: type,
      name: options.name
    });

  });
}


// receives an array with all the airlines and the destinations page link 
// for each one of them, iterates for each one of them, calling getScraperType
// and adding it to the proper airline.
function getScraperTypeForAll(options, callback) {

  var destinationsFile = options.destinationsFile;
  var airlines = options.airlines;

  async.mapLimit(airlines, 20, function (options, callback) {
    async.retry(3, function (callback) {
      getScraperType(options, callback);
    }, callback);
  }, function (err, results) {
    if (err) {
      return callback(err);
    }
    debug("got %d results", results.length);
    airlines = _.reduce(results, function (airlines, result) {
      // finds the position of the airline
      var index = _.findIndex(airlines, {
        name: result.name
      });

      // adds the scraper to the exact position retrieved on the previous position.
      airlines[index].scraper = result.type;
      return airlines;
    }, airlines);
    // saves the file with all the scrapers added.
    fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));

    debug("Saved %s", destinationsFile);
    callback(null, airlines);
  });
}
module.exports = {
  getScraperType: getScraperType,
  getScraperTypeForAll: getScraperTypeForAll
};
