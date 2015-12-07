  "use strict";

  var sjs = require("scraperjs");
  var fs = require("fs");
  var async = require("async");
  var scrapers = require("../scrapers/");
  var _ = require("lodash");
  var destinationsFile = "../data/destination_pages.json";
  var BASE_URL = "https://en.wikipedia.org";

  var airlines = require(destinationsFile);

  function getScraperType(options, callback) {
    var url = BASE_URL + options.destinationsLink;

    console.log("Getting scraper for %s from %s", options.name, url);// eslint-disable-line no-console
    sjs.StaticScraper.create(url)
      .scrape(scrapers["type_of_scrapper"])
      .then(function (type) {
        callback(null, {type: type, name: options.name});
      });
  }

  // getScraperType(airlines[0], writeJson);

  async.map(airlines, function (options, callback) {
    getScraperType(options, callback);
  },  function (err, results) {
    if (err) {
      throw err;
    }
    airlines = _.reduce(results, function(airlines, result){
      var index = _.findIndex(airlines,{name: result.name});

      airlines[index].scraper = result.type;
      return airlines;
    }, airlines);
    fs.writeFileSync(destinationsFile, JSON.stringify(airlines,null,2));
    console.log("Saved %s", destinationsFile);// eslint-disable-line no-console
  });
