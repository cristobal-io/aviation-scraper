"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");

var debug = require("debug")("airlineData:links");

function getDestinationsPages(options, callback) {
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
      callback(null, destinations);
    });
}
/**
 * Cleaning object with duplicated values
 * @param  {object} objectWithDuplicates is the object we need to clean
 * @param  {string} groupKey             defines the key we want to compare(optional)
 * @return {object}                      The object cleaned
 */
function cleanDuplicates(objectWithDuplicates, groupKey) {
  groupKey = groupKey || Object.keys(objectWithDuplicates[0])[0];

  var cleanedObject = _.map(_.groupBy(objectWithDuplicates, function (value) {
    return value[groupKey];
  }), function (grouped) {
    return grouped[0];
  });

  return cleanedObject;
}

function getAllDestinationsPages(options, callback) {
  var urls;

  ensureDirectoryExist("./data/", function () {
    if (process.env.NODE_ENV === "test") {
      urls = options.urls;
      mapUrl(urls);
    } else {
      urls = getAllLinks(options, function (err, urls) {
        mapUrl(urls);
      });
    }
  });


  function mapUrl(urls) {
    var destinationsFile = options.destinationsFile;
    
    async.map(urls, function (options, callback) {
      getDestinationsPages(options, callback);
    }, function (err, results) {
      if (err) {
        throw err;
      }
      // todo: check the special case were this cleaning is needed.
      var airlines = cleanDuplicates(_.flatten(results, true));

      fs.writeFile(destinationsFile, JSON.stringify(airlines, null, 2), function (err) {
        if (err) {
          throw (err);
        }
      });
      debug("Saved %s", destinationsFile);
      callback(null, airlines);
    });
  }
}

function ensureDirectoryExist(directory, callback) {
  fs.readdir(directory, function (err) {
    if (err) {
      fs.mkdir(directory, function () {
        debug("created data directory");
        callback(false);
      });
    } else {
      callback(true);
    }
  });
}


module.exports = {
  getDestinationsPages: getDestinationsPages,
  getAllDestinationsPages: getAllDestinationsPages,
  getAllLinks: getAllLinks,
  cleanDuplicates: cleanDuplicates,
  ensureDirectoryExist: ensureDirectoryExist
};
