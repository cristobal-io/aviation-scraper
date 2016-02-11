"use strict";

// Dependencies
var url = require("url");
var async = require("async");
var fs = require("fs");
var https = require("https");

// App variables
var BASE_URL = "https://en.wikipedia.org/wiki/";

var DOWNLOAD_DIR = "./test/spec/local_pages/";
var airlineFixtures = require("../fixtures/airline_routes.options.json");
var airportFixtures = require("../fixtures/airport_links.json");
var iataLocalList = require("../fixtures/airports_iata.data.json");
var file_url = [
  "Category:Lists_of_airline_destinations"
];

for (var i = 0; i < airlineFixtures.length; i += 1) {
  file_url.push(airlineFixtures[i].name);
}

for (var j = 0; j < airportFixtures.length; j += 1) {
  file_url.push(airportFixtures[j].url);
}

for (var k = 0; k < iataLocalList.length; k += 1) {
  file_url.push(iataLocalList[k]);
}

var download_file_httpsGet = function (file_url, callback) {
  if (file_url.indexOf("https") === -1) {
    file_url = BASE_URL + file_url;
  }
  var file_name = decodeURI(url.parse(file_url).pathname.split("/").pop());

// bermi if I don't add the following line, I am having issues with the tests
// I should be able to use naming like "Category:Lists_of_airline_destinations"
  file_name = file_name.split(":").pop();
  console.log("filename: " + file_name); //eslint-disable-line no-console
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  https.get(file_url, function (res) {
    res.on("data", function (chunk) {
      file.write(chunk);
    }).on("error", function (err) {
      throw err;
    }).on("end", function () {
      file.end();
      console.log(file_name + " downloaded to " + DOWNLOAD_DIR);
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
