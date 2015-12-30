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

  if (process.env.NODE_ENV === "test") {
    urls = [options.urls];
    mapUrl(urls);
  } else {
    urls = getAllLinks(options, function (err, urls) {
      mapUrl(urls);
    });
  }

  function mapUrl(urls) {
    var destinationsFile = options.destinationsFile;

    // Bermi: here we have a racing condition situation.
    // for better understanding of the code, I would take it together with 
    // fs.write, but it's not working properly if we do it that way.
    // is it ok to keep it this way?
    fs.access(destinationsFile, function (err) {
      if (err) {
        fs.mkdir("./data/", function () {
          console.log("created data directory");// eslint-disable-line no-console
        });
      }
    });
    async.map(urls, function (options, callback) {
      getDestinations(options, callback);
    }, function (err, results) {
      if (err) {
        throw err;
      }
      var airlines = _.uniq(_.flatten(results, true), "name");


      fs.writeFile(destinationsFile, JSON.stringify(airlines, null, 2), function (err) {
        if (err) {
          throw (err);
        }
      });
      if (process.env.NODE_ENV !== "test") {
        console.log("Saved %s", destinationsFile); // eslint-disable-line no-console
      }
      callback(null, airlines);
    });
  }

}


module.exports.getDestinations = getDestinations;
module.exports.getAllDestinations = getAllDestinations;
module.exports.getAllLinks = getAllLinks;
