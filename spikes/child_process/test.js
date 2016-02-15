/*eslint-disable no-console*/
"use strict";
var child_process = require("child_process");

child_process.exec("./test hello", function (err, stdout, stderr) {
  if (err) {
    console.log("child processes failed with error code: " +
      err.code);
  }
  console.log(typeof stdout);
  console.log(stdout);

  console.log(JSON.stringify(stdout));
  console.log(stderr);
});
