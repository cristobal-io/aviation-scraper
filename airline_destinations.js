"use strict";

var fs = require("fs");
var scraperjs = require("scraperjs");
var scrapers = require("./scrapers/");
var _ = require("lodash");
var async = require("async");

var destinationsFile = "./data/destination_pages.json";
var BASE_URL = "https://en.wikipedia.org/w/index.php?title=Category:Lists_of_airline_destinations&from=";
var url = [];

// generate the array with all the links

for (var i = 65; i <= 90; i += 1) {
  url.push(BASE_URL + String.fromCharCode(i));
}

// Array with urls generated.

function getDestinations(options, callback) {
  var letter = options.charAt(options.length-1);

  console.log("Getting scraper for %s from %s", letter, options);
  scraperjs.StaticScraper.create(options)
    .scrape(scrapers["destinations"])
    .then(function (destinations) {
      callback(null, destinations);
    });
}


async.map(url, function (options, callback) {
  getDestinations(options, callback);
}, function (err, results) {
  if (err) {
    throw err;
  }
  var airlines = _.flatten(results, true);

  fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));
  console.log("Saved %s", destinationsFile);
});
