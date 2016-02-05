"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");

var debug = require("debug")("airlineData:links");

function getDestinations(options, callback) {
  var letter = options.charAt(options.length - 1);


  debug("Getting scraper for %s from %s", letter, options);
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

  ensureDirectoryExist(function () {
    // body...
    if (process.env.NODE_ENV === "test") {
      urls = [options.urls];
      mapUrl(urls);
    } else {
      urls = getAllLinks(options, function (err, urls) {
        mapUrl(urls);
      });
    }
  });

  function ensureDirectoryExist( callback) {
    fs.access(options.destinationsFile, function (err) {
      if (err) {
        fs.mkdir("./data/", function () {
          debug("created data directory"); // eslint-disable-line no-console
          callback();
        });
      } else {
        callback();
      }
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
      // todo this seems it's not cleaning the duplicates.
      var airlines = _.uniq(_.flatten(results, true), "name");


      fs.writeFile(destinationsFile, JSON.stringify(airlines, null, 2), function (err) {
        if (err) {
          throw (err);
        }
      });
      debug("Saved %s", destinationsFile); // eslint-disable-line no-console
      callback(null, airlines);
    });
  }

}


module.exports.getDestinations = getDestinations;
module.exports.getAllDestinations = getAllDestinations;
module.exports.getAllLinks = getAllLinks;
