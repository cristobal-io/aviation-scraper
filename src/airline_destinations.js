"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");

var destinationsFile = "./data/destination_pages.json";
var BASE_URL = "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations&from=";


function getDestinations(options, callback) {
  var letter = options.charAt(options.length - 1);


  if (process.env.NODE_ENV !== "test") {
    console.log("Getting scraper for %s from %s", letter, options);// eslint-disable-line no-console
  }
  scraperjs.StaticScraper.create(options)
    .scrape(scrapers["destinations"])
    .then(function (destinations) {
      callback(null, destinations);
    });
}

function getAllDestinations (options, callback) {
  destinationsFile = options.destinationsFile || destinationsFile;

  var urls = options.url || _.map("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), function (letter) {
    return BASE_URL + letter;
  });


  async.map(urls, function (options, callback) {
    getDestinations(options, callback);
  }, function (err, results) {
    if (err) {
      throw err;
    }
    var airlines = _.flatten(results, true);

    fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));
    if (process.env.NODE_ENV !== "test") {
      console.log("Saved %s", destinationsFile);// eslint-disable-line no-console
    }
    callback(null, airlines);
  });

}

module.exports.getDestinations = getDestinations;
module.exports.getAllDestinations = getAllDestinations;
