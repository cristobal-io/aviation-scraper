"use strict";

// Dependencies
var url = require("url");
var async = require("async");
var fs = require("fs");
var https = require("https");

// App variables
var BASE_URL = "https://en.wikipedia.org/wiki/";
var file_url = [
  "Adria_Airways_destinations",
  "AeroSur_destinations",
  "Aegean_Airlines_destinations",
  "Air_Austral_destinations",
  "Air_Nippon_destinations",
  "Air_Arabia_Maroc_destinations",
  "Air_Chathams_destinations",
  "VietJet_Air_destinations",
  "Aeroper%C3%BA_destinations",
  "Category:Lists_of_airline_destinations"
];
var DOWNLOAD_DIR = "./test/spec/models/";


var download_file_httpsGet = function (file_url, callback) {
  if (file_url.indexOf("https") === -1) {
    file_url = BASE_URL + file_url;
  }

  var file_name = url.parse(file_url).pathname.split("/").pop() + ".html";

  file_name = file_name.split(":").pop();
  console.log("filename: " + file_name);//eslint-disable-line no-console
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  https.get(file_url, function (res) {
    res.on("data", function (chunk) {
      file.write(chunk);
    }).on("error", function (err) {
      throw err;
    }).on("end", function () {
      file.end();
      console.log(file_name + " downloaded to " + DOWNLOAD_DIR);//eslint-disable-line no-console
      callback();
    });
  });

};

async.map(file_url, download_file_httpsGet, function (err) {
  if (err) {throw err;}
  console.log("\nModels updated."); //eslint-disable-line no-console
});

