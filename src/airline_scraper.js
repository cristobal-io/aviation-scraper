"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var async = require("async");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var destinationsFile = "../data/destination_pages.json";
var BASE_URL = "https://en.wikipedia.org";

var airlines = require(destinationsFile);

function getScraperType(options, callback) {
  var url = options.url || BASE_URL + options.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting scraper for %s from %s", options.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .scrape(scrapers["type_of_scrapper"])
    .then(function (type) {
      callback(null, {
        type: type,
        name: options.name
      });
    });
}

// getScraperType(airlines[0], writeJson);
// function not tested or run yet.
function getScraperTypeForAll(options, callback) {

  // for modularity purposes
  destinationsFile = options.destinationsFile || destinationsFile;
  airlines = options.airlines || airlines;
  async.map(airlines, function (options, callback) {
    getScraperType(options, callback);
  }, function (err, results) {
    if (err) {
      throw err;
    }
    airlines = _.reduce(results, function (airlines, result) {
      var index = _.findIndex(airlines, {
        name: result.name
      });

      airlines[index].scraper = result.type;
      return airlines;
    }, airlines);
    fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));

    if (process.env.NODE_ENV !== "test") {
      console.log("Saved %s", destinationsFile); // eslint-disable-line no-console
    }
    callback(airlines);
  });
}

module.exports.getScraperType = getScraperType;
module.exports.getScraperTypeForAll = getScraperTypeForAll;
