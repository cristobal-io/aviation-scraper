"use strict";
var chalk = require("chalk");
var debug = require("debug")("aviation-scraper:airline");
var sjs = require("scraperjs");

var scrapers = require("../scrapers/");
var async = require("async");
var _ = require("lodash");

var BASE_URL = "http://localhost:3000/";
var WIKI_URL = "https://en.wikipedia.org";

function prepareUri(url) {
  if (process.env.NODE_ENV === "test") {
    url = BASE_URL + url.replace("/wiki/", "");
  } else {
    url = WIKI_URL + url;
  }
  return url;
}

function getAirlineData(airline, callback) {
  var url = prepareUri(airline);

  debug("Getting airline data from %s", url);
  callScraper(url, "airline",callback);
}

function getAllAirlinesData(airlines, callback) {
  airlines = _.map(_.filter(airlines, "airline.link"), function (airlineData) {
    return prepareUri(airlineData.airline.link);
  });

  callScraperForEachLink(airlines, "airline", function (err, results) {
    results = _.filter(results, "name");
    callback(err, results);
  });
}

function getAllAirlinesLinks(url, callback) {
  callScraper(url, "airlineLinks", callback);
}


function callScraper(url, scraper, callback) {
  debug("scrapping: %s", url);
  sjs.StaticScraper.create(url)
    .catch(function (err) {
      if (err) {
        debug(chalk.red("\nerror %s, %s \n"), err, url);
        callback(err, url);
        return;
      }
    })
    .scrape(scrapers[scraper])
    .then(function (data, utils) {
      callback(utils.params, data);
    });
}

function callScraperForEachLink(linksList, scraper, callback) {
  async.mapLimit(_.clone(linksList, true), 20, function (link, callback) {

    async.retry(5, function (callback) {
      callScraper(link, scraper, callback);
    }, callback);

  },callback);

}


module.exports.getAirlineData = getAirlineData;
module.exports.callScraper = callScraper;
module.exports.callScraperForEachLink = callScraperForEachLink;
module.exports.getAllAirlinesLinks = getAllAirlinesLinks;
module.exports.getAllAirlinesData = getAllAirlinesData;
