  // to check wich scraper to use we can do it by checking 
  // if there are wikitables
  // $(".wikitable").hasClass("wikitable")
  "use strict";

  var sjs = require("scraperjs");
  // var fs = require("fs");
  var async = require("async");
  var scrapers = require("./scrapers/");

  var BASE_URL = "https://en.wikipedia.org";

  var airlines = require("./data/destination_pages.json");

  function getRoutes(options, key, callback) {
    var url = BASE_URL + options.destinationsLink;


    console.log("Getting scraper for %s from %s", options.name, url);
    sjs.StaticScraper.create(url)
      .scrape(scrapers["type_of_scrapper"]) //scrapers[options.scraper] ||
      .then(function (data) {
        // console.log("Results for %s", options.name);
        // console.log(JSON.stringify(data, null, 2));
        // console.log(key);
        callback(null, data, key, options);
      });
  }

  var writeJson = function (err, scraper, key, options) {
    console.log(key);

    if (err) {
      throw err;
    }
    options.scraper = scraper;
    // console.log(JSON.stringify(options, null, 2));

    airlines[key] = options;
    // console.log(JSON.stringify(airlines, null, 2));
    return airlines;
    // var filename = "./data/routes_" + options.name + ".json";
    // fs.writeFile(filename,
    //   JSON.stringify(routes, null, 2),
    //   function (err) {
    //     if (err) {
    //       throw err;
    //     }
    //     console.log("Saved %s", filename);
    //   }
    // );
  };


  // getRoutes(airlines[0], writeJson);
  async.waterfall([
    function (callback) {
      async.forEachOf(airlines, function (value, key) {
        console.log(key);
        getRoutes(value, key, writeJson);
        console.log(value);
        // console.log(callback);
      }, function (err) {
        callback();
        if (err) {
          throw err;
        }
      });
    },
    function () {
      console.log("called final callback");
    }
  ], function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
  });
