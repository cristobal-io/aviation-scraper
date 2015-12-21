"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");


function getDestinations(options, callback) {
  var letter = options.charAt(options.length - 1);


  if (process.env.NODE_ENV !== "test") {
    console.log("Getting scraper for %s from %s", letter, options); // eslint-disable-line no-console
  }
  scraperjs.StaticScraper.create(options)
    .scrape(scrapers["destinations"])
    .then(function (destinations) {
      callback(null, destinations);
    });
}

function getAllLinks(options, callback) {
  var url = options.urls;

  scraperjs.StaticScraper.create(url)
    .scrape(scrapers["destinations_link"])
    .then(function (destinations) {
      // console.log(destinations);
      callback(null, destinations);
    });
}

function getAllDestinations(options, callback) {
  var urls;

  console.log(options);

  // bermi: I don't like this trick that modifies the src code 
  // so I am able to use it easily on my test.
  if (typeof options.urls === "string") {
    urls = [options.urls];
    mapUrl(urls);
  } else {
    urls = getAllLinks(options.urls, function (err, urls) {
      console.log(urls);
      mapUrl(urls);
    });
  }

  function mapUrl(urls) {
    var destinationsFile = options.destinationsFile;

    async.map(urls, function (options, callback) {
      getDestinations(options, callback);
    }, function (err, results) {
      if (err) {
        throw err;
      }
      var airlines = _.flatten(results, true);

      fs.writeFileSync(destinationsFile, JSON.stringify(airlines, null, 2));
      if (process.env.NODE_ENV !== "test") {
        console.log("Saved %s", destinationsFile); // eslint-disable-line no-console
      }
      callback(null, airlines);
    });
  }

}

// getAllDestinations("", function () {
//   console.log("finished callback");
// });

module.exports.getDestinations = getDestinations;
module.exports.getAllDestinations = getAllDestinations;
module.exports.getAllLinks = getAllLinks;
