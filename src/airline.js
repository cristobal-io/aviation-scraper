"use strict";
// var chalk = require("chalk");
var debug = require("debug")("airlineData:airline");
var sjs = require("scraperjs");

var scrapers = require("../scrapers/");
var async = require("async");
var _ = require("lodash");

var BASE_URL = "http://localhost:3000/";


function getAirlineData(airline, callback) {
  var url = airline;

  debug("Getting airline data from %s", url);
  callScraper(url, "airline", function (err, data) {
    callback(err, data);
  });
}

function getAllAirlinesData(airlines, callback) {

  airlines = _.map(_.filter(airlines, "airline.link"), function (airlineData) {
    return airlineData.airline.link;
  });

  if (process.env.NODE_ENV === "test") {
    airlines = _.map(airlines, function (airlineLink) {
      return BASE_URL + airlineLink.replace("/wiki/", "");
    });
  }

  callScraperForEachLink(airlines, "airline", function (err, results) {
    // bermi: can I put only callback? 
    // or I have to specify what is being returned?
    callback(err, results);
  });
}

function getAllAirlinesLinks(url, callback) {
  callScraper(url, "airlineLinks", function (err, results) {
    callback(err, results);
  });
}


function callScraper(url, scraper, callback) {
  sjs.StaticScraper.create(url)
    // .catch(function (err) {
    //   // Bermi, if I get an error because of a missing property, I get this catch called.
    //   // I think it shouldn'be calling this callback, because the error is coming from
    //   // schema validation, this schema validation is being done at the test. It seems like 
    //   // this executes the callback at the same time it sends it back.
    //   // Seems like the catch is calling the callback as well as the .then
    //   if (err) {
    //     debug(chalk.red("\nerror %s, %s \n"), err, url);
    //     callback(err, url);
    //   }
    // })
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

  }, function (err, results) {
    callback(err, results);
  });

}


module.exports.getAirlineData = getAirlineData;
module.exports.callScraper = callScraper;
module.exports.callScraperForEachLink = callScraperForEachLink;
module.exports.getAllAirlinesLinks = getAllAirlinesLinks;
module.exports.getAllAirlinesData = getAllAirlinesData;
