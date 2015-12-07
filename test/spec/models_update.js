
"use strict";

// courtesy of:
// http://www.hacksparrow.com/using-node-js-to-download-files.html

// Dependencies
var url = require("url");
var exec = require("child_process").exec;

// App variables
var file_url = "https://en.wikipedia.org/wiki/AeroSur_destinations";
var DOWNLOAD_DIR = "./test/spec/models/";

// Function to download file using wget
var download_file_wget = function (file_url) {

  // extract the file name
  var file_name = url.parse(file_url).pathname.split("/").pop();

  // compose the wget command
  var wget = "wget -P " + DOWNLOAD_DIR + " " + file_url;

  // var wget = "wget -p -k " + DOWNLOAD_DIR + " " + file_url;
  // excute wget using child_process" exec function

  /*eslint-disable no-unused-vars */
  var child = exec(wget, function (err, stdout, stderr) {
    if (err) {
      throw err;
    } else {
      console.log(file_name + " downloaded to " + DOWNLOAD_DIR);
    }
  });
  /*eslint-enable no-unused-vars */
};

download_file_wget(file_url);

