  "use strict";

  var sjs = require("scraperjs");
  var fs = require("fs");
  var async = require("async");
  var scrapers = require("./scrapers/");
  var _ = require("lodash");

  var BASE_URL = "https://en.wikipedia.org";

  var airlines = require("./data/destination_pages.json");

  function getRoutes(options, key, callback) {
    var url = BASE_URL + options.destinationsLink;

    console.log("Getting scraper for %s from %s", options.name, url);
    sjs.StaticScraper.create(url)
      .scrape(scrapers["type_of_scrapper"])
      .then(function (data) {
        callback(null, data, key, options);
      });
  }

  var writeJson = function (err, scraper, key, options) {
    var filename = "./data/destination_pages.json";

    if (err) {
      throw err;
    }
    options.scraper = scraper;
    airlines[key] = options;

    if (_.every(airlines, "scraper")) {
      fs.writeFile(filename,
        JSON.stringify(airlines, null, 2),
        function (err) {
          if (err) {
            throw err;
          }
          console.log("Saved %s", filename);
        }
      );
    }
  };

  // getRoutes(airlines[0], writeJson);

  async.forEachOf(airlines, function (value, key, callback) {
    getRoutes(value, key, writeJson);
    callback();
  }, function (err) {
    if (err) {
      throw err;
    }
  });
