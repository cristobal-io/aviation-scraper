"use strict";

var server = require("./server.js");

describe("server working", function () {
  it("should be on", function () {
    server.start("./index.html", "./404.html", 8080, function () {
      debugger;
      console.log("called");
    });
  });
});
