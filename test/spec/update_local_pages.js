"use strict";

// Dependencies
var async = require("async");
var fs = require("fs");
var https = require("https");
var debug = require("debug")("aviation-data:local_pages");
// App variables
var BASE_URL = "https://en.wikipedia.org/wiki/";
var BASE_URL_PAGES = "https://en.wikipedia.org/w/index.php?title=";

var DOWNLOAD_DIR = "./test/spec/local_pages/";
var airlineFixtures = require("../fixtures/airline_destinations.options.json");
var airportFixtures = require("../fixtures/airport_links.json");
var iataLocalList = require("../fixtures/airports_iata.data.json");
var destinationsPages = require("../fixtures/airline_destination_pages_links.json");
var airlines = require("../fixtures/airlines.json");
var file_url = [];

for (var m = 0; m < airlines.length; m += 1) {
  file_url.push({
    "fileName": airlines[m],
    "url": BASE_URL + airlines[m]
  });
}

for (var i = 0; i < airlineFixtures.length; i += 1) {
  file_url.push({
    "fileName": airlineFixtures[i].name,
    "url": BASE_URL + airlineFixtures[i].name
  });
}

for (var j = 0; j < airportFixtures.length; j += 1) {
  file_url.push({
    "fileName": airportFixtures[j].url,
    "url": BASE_URL + airportFixtures[j].url
  });
}

for (var k = 0; k < iataLocalList.length; k += 1) {
  file_url.push({
    "fileName": iataLocalList[k],
    "url": BASE_URL + iataLocalList[k]
  });
}
for (var l = 0; l < destinationsPages.length; l += 1) {

  file_url.push({
    "fileName": destinationsPages[l],
    "url": BASE_URL_PAGES + destinationsPages[l]
  });
}

var download_file_httpsGet = function (file_url, callback) {
  var file_name = decodeURI(file_url.fileName);

  debug("filename: " + file_name);
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  https.get(file_url.url, function (res) {
    res.on("data", function (chunk) {
      file.write(chunk);
    }).on("error", function (err) {
      throw err;
    }).on("end", function () {
      file.end();
      debug(file_name + " downloaded to " + DOWNLOAD_DIR);
      callback();
    });
  });

};

async.map(file_url, download_file_httpsGet, function (err) {
  if (err) {
    throw err;
  }
  console.log("\nLocal Pages Updated."); //eslint-disable-line no-console
});
