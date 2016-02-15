"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var async = require("async");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var destinationsFile = "./data/destination_pages.json";
var BASE_URL = "https://en.wikipedia.org";
var debug = require("debug")("airlineData:scrapers");


function getScraperType(options, callback) {
  var url = options.url || BASE_URL + options.destinationsLink;

  debug("Getting scraper for %s from %s", options.name, url); 
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        debug("error from %s is %s, %s", options.name, err, url);
        callback(err, utils);
      }
    })
    .scrape(scrapers["type_of_scrapper"])
    .then(function (type) {
      debug("found %s from %s",type, url);
      callback(null, {
        type: type,
        name: options.name
      });
    });
}

function getScraperTypeForAll(options, callback) {

  // for modularity purposes
  destinationsFile = options.destinationsFile || destinationsFile;
  var airlines = options.airlines || airlines;

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
      var index = _.findIndex(airlines, {
        name: result.name
      });

      // console.log("airline %s found at position %d", result.name, index );

      airlines[index].scraper = result.type;
      return airlines;
    }, airlines);
    fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));

    debug("Saved %s", destinationsFile);
    callback(null, airlines);
  });
}

module.exports.getScraperType = getScraperType;
module.exports.getScraperTypeForAll = getScraperTypeForAll;

