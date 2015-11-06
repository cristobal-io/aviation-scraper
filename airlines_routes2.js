/**
 * DISCLAIMER
 * This is a relatively simple example, to illustrate some of the
 *   possible functionalities and how to achieve them.
 *   There is no guarantee that this example will provide useful
 *   results.
 *   Use this example with and at your own responsibility.
 *
 * In this example we run through some urls and try to extract their
 *   30th link. It demonstrates how to deal with errors.
 *
 * To run:
 * 'node ErrorHandling.js'
 */

var sjs = require("scraperjs");
var fs = require("fs");


var log = console.log;
var router = new sjs.Router();

var BASE_PATH = "https://en.wikipedia.org";

var airlines = JSON.parse(fs.readFileSync("./data/destination_pages.json"));


function create30thLinkError() {
  var err = new Error("Page doesn't have 30th link");
  err.code = '30THLINK';
  return err;
}

router
  .on('*')
  .createStatic()
  .scrape(function($, airlineName) {
    var thirty = $('a')[30];
    if (thirty) {
      return $(thirty).attr('href');
    } else {
      throw create30thLinkError();
    }
  })
  .then(function(thirty, utils) {
    log("'%s' has '%s' as it's 30th link", utils.url, thirty);
  });



for (var i = 0; i < airlines.length; i++) {
  var airlineName = airlines[i]["name"];
  var airlineLink = BASE_PATH + airlines[i]["destinationsLink"];
  router.route(airlineLink, airlineName);
};