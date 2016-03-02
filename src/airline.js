"use strict";
var chalk = require("chalk");
var debug = require("debug")("airlineData:airline");
var sjs = require("scraperjs");

var scrapers = require("../scrapers/");


function getAirlineData(airline, callback) {
  var url = airline;

  debug("Getting airline data from %s", url);
  callScraper(url, "airline", function (err, data) {
    callback(err, data);
  });
}


function callScraper(url,scraper, callback) {
  sjs.StaticScraper.create(url)
    // .catch(function (err, utils) {
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


module.exports.getAirlineData = getAirlineData;
module.exports.callScraper = callScraper;
