/*eslint no-unused-vars: 0*/
/*global stderr */

"use strict";

var sjs = require("scraperjs");
var fs = require("fs");

function getRoutes() {
  var url = "https://en.wikipedia.org/wiki/AeroSur_destinations";


  console.log("Getting routes for %s from %s", "Aerosur", url);
  sjs.StaticScraper.create(url)
    .scrape(function ($) {
      return $("body");
    })
    .then(function (data) {
      // console.log("Results for %s", options.name);
      // console.log(JSON.stringify(data, null, 2));
      var filename = "./models/aerosur_html.json";

      fs.writeFile(filename,
        JSON.stringify(data, null, 2),
        function (err) {
          if (err) {
            throw err;
          }
          console.log("Saved %s", filename);
        }
      );
    });
}

getRoutes();


// courtesy of:
// http://www.hacksparrow.com/using-node-js-to-download-files.html

// Dependencies
// var fs = require("fs");
var url = require("url");
// var http = require("http");
var exec = require("child_process").exec;
// var spawn = require("child_process").spawn;

// App variables
var file_url = "http://upload.wikimedia.org/wikipedia/commons/4/4f/Big%26Small_edit_1.jpg";
var DOWNLOAD_DIR = "./downloads/";

// We will be downloading the files to a directory, so make sure it"s there
// This step is not required if you have manually created the directory

var mkdir = "mkdir -p " + DOWNLOAD_DIR;
var child = exec(mkdir, function (err, stdout, stderr) {
  if (err) {
    throw err;
  } else {
    download_file_wget(file_url);
  }
});

// Function to download file using wget
var download_file_wget = function (file_url) {

  // extract the file name
  var file_name = url.parse(file_url).pathname.split("/").pop();
  // compose the wget command
  var wget = "wget -P " + DOWNLOAD_DIR + " " + file_url;
  // excute wget using child_process" exec function

  var child = exec(wget, function (err, stdout, stderr) {
    if (err) {
      throw err;
    } else {
      console.log(file_name + " downloaded to " + DOWNLOAD_DIR);
    }
  });
};
