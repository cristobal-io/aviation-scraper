"use strict";

// Dependencies
var url = require("url");
var async = require("async");
var fs = require("fs");
var https = require("https");
var debug = require("debug")("airlineData:local_pages");
// App variables
var BASE_URL = "https://en.wikipedia.org/wiki/";
var BASE_URL_PAGES = "https://en.wikipedia.org/w/index.php?title=";

var DOWNLOAD_DIR = "./test/spec/local_pages/";
var airlineFixtures = require("../fixtures/airline_destinations.options.json");
var airportFixtures = require("../fixtures/airport_links.json");
var iataLocalList = require("../fixtures/airports_iata.data.json");
var destinationsPages = require("../fixtures/airline_destination_pages_links.json");
var file_url = [];

for (var i = 0; i < airlineFixtures.length; i += 1) {
  file_url.push(BASE_URL + airlineFixtures[i].name);
}

for (var j = 0; j < airportFixtures.length; j += 1) {
  file_url.push(BASE_URL + airportFixtures[j].url);
}

for (var k = 0; k < iataLocalList.length; k += 1) {
  file_url.push(BASE_URL + iataLocalList[k]);
}
for (var l = 0; l < destinationsPages.length; l += 1) {

  file_url.push(BASE_URL_PAGES + destinationsPages[l]);
}

var download_file_httpsGet = function (file_url, callback) {
  // if (file_url.indexOf("https") === -1) {
  //   file_url = BASE_URL + file_url;
  // }
  debugger;
  var file_name = decodeURI(url.parse(file_url).pathname.split("/").pop());

  debug("filename: " + file_name);
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  https.get(file_url, function (res) {
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
