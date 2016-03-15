"use strict";

var fs = require("fs");

var scraperjs = require("scraperjs");
var scrapers = require("../scrapers/");
var _ = require("lodash");
var async = require("async");

var callScraper = require("./airline.js").callScraper;

var debug = require("debug")("aviation-data:links");

// scrape a single webpage for all the destinations links of all the
// airlines at the site.
function getDestinationsPages(options, callback) {
  var letter = options.charAt(options.length - 1);

  debug("Getting scraper for %s from %s", letter, options);
  callScraper(options, "destinations", callback);
}

// connects to the main page and gets all the links for all the pages that
// we are going to need to scrape individually with getDestinationsPages.
// Usually the links follow the alphabet.
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

// we pass an array of getDestinationsPages links and the function manage
// to call the function to scrape the links one by one.
function getAllDestinationsPages(options, callback) {
  var urls;

  // we need to check for the directory and create it in case doesn't exist,
  // because we are going to save there our files.
  ensureDirectoryExist("./data/", function () {
    // conditional to check if we are into a test process so we use the local
    // pages instead of using the web.
    if (process.env.NODE_ENV === "test") {
      urls = options.urls;
      mapUrl(urls);
    } else {
      urls = getAllLinks(options, function (err, urls) {
        mapUrl(urls);
      });
    }
  });

  // call getDestinationsPages with each link and save into a single file
  // specified at the options object passed.
  function mapUrl(urls) {
    var destinationsFile = options.destinationsFile;

    async.map(urls, function (options, callback) {
      getDestinationsPages(options, callback);
    }, function (err, results) {
      if (err) {
        throw err;
      }
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

// check if a directory exist and if don't, proceed to create it.
function ensureDirectoryExist(directory, callback) {
  fs.readdir(directory, function (err) {
    if (err) {
      fs.mkdir(directory, function () {
        debug("created " + directory + " directory");
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
