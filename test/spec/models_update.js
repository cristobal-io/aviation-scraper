"use strict";

// courtesy of:
// http://www.hacksparrow.com/using-node-js-to-download-files.html

// Dependencies
var url = require("url");
var exec = require("child_process").exec;
var async = require("async");

// App variables
var BASE_URL = "https://en.wikipedia.org/wiki/";
var file_url = [
  "Adria_Airways_destinations",
  "AeroSur_destinations",
  "Aegean_Airlines_destinations"
];
var DOWNLOAD_DIR = "./test/spec/models/";
var DESTINATIONS_URL = "https://en.wikipedia.org/wiki/Category:Lists_of_airline_destinations";

// // Function to download file using wget
// var download_file_wget = function (file_url, callback) {
//   if (file_url.indexOf("http") === -1) {
//     file_url = BASE_URL + file_url;
//   }

//   // extract the file name
//   var file_name = url.parse(file_url).pathname.split("/").pop();

//   // compose the wget command
//   var wget = "wget -P " + DOWNLOAD_DIR + " " + file_url + " --no-check-certificate";

//   // var wget = "wget -p -k " + DOWNLOAD_DIR + " " + file_url;
//   // excute wget using child_process" exec function


//   var child = exec(wget, function (err, stdout, stderr) { //eslint-disable-line no-unused-vars 
//     if (err) {
//       throw err;
//     } else {
//       console.log(file_name + " downloaded to " + DOWNLOAD_DIR); // eslint-disable-line no-console
//       callback();
//     }
//   });

// };

// async.map(file_url, download_file_wget, function () {
//   console.log("Async finished"); // eslint-disable-line no-console
// });

// download_file_wget(DESTINATIONS_URL, function () {
//   console.log("destinations file downloaded"); //eslint-disable-line no-console
// });

// Dependencies
var fs = require("fs");
var http = require("http");

// Function to download file using HTTP.get
var download_file_httpget = function (file_url) {
  if (file_url.indexOf("http") === -1) {
    file_url = BASE_URL + file_url;
  }
  console.log(file_url);
  var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
  };

  console.log(options);
  var file_name = url.parse(file_url).pathname.split("/").pop();

  console.log("filename: " + file_name);
  var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

  var req = http.request(options, function (res) {
    console.log("STATUS: " + res.statusCode);
    console.log("HEADERS: " + JSON.stringify(res.headers));
    res.on("data", function (data) {
      console.log(data);
      file.write(data);
    }).on("error", function (err) {
      throw err;
    }).on("end", function () {
      file.end();
      console.log(file_name + " downloaded to " + DOWNLOAD_DIR);
    });
  });

  req.on("error", function (err) {
    throw err;
  });
  req.end();
};

download_file_httpget(file_url[0], function () {
  console.log("destinations file downloaded"); //eslint-disable-line no-console
});

var request = require("request");

request("http://www.sitepoint.com", function(error, response, body) {
  console.log("sitepoint: "+ body);
});
