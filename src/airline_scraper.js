"use strict";

var sjs = require("scraperjs");
var fs = require("fs");
var async = require("async");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var destinationsFile = "./data/destination_pages.json";
var BASE_URL = "https://en.wikipedia.org";
// todo: check for the file if it exist. 
// try catch


function getScraperType(options, callback) {
  var url = options.url || BASE_URL + options.destinationsLink;

  if (process.env.NODE_ENV !== "test") {
    console.log("Getting scraper for %s from %s", options.name, url); // eslint-disable-line no-console
  }
  sjs.StaticScraper.create(url)
    .catch(function (err, utils) {
      if (err) {
        console.log("error from %s is %s, %s", options.name, err, url); // eslint-disable-line no-console
        callback(err, utils);
      }
    })
    .scrape(scrapers["type_of_scrapper"])
    .then(function (type) {
      if (process.env.NODE_ENV !== "test") {
        console.log("found %s from %s",type, url); // eslint-disable-line no-console
      }
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
      // console.log(err); // eslint-disable-line no-console
      return callback(err);
    }
    if (process.env.NODE_ENV !== "test") {
      console.log("got %d results", results.length); // eslint-disable-line no-console
    }
    airlines = _.reduce(results, function (airlines, result) {
      var index = _.findIndex(airlines, {
        name: result.name
      });

      // console.log("airline %s found at position %d", result.name, index );

      airlines[index].scraper = result.type;
      return airlines;
    }, airlines);
    fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));

    if (process.env.NODE_ENV !== "test") {
      console.log("Saved %s", destinationsFile); // eslint-disable-line no-console
    }
    callback(null, airlines);
  });
}

module.exports.getScraperType = getScraperType;
module.exports.getScraperTypeForAll = getScraperTypeForAll;

