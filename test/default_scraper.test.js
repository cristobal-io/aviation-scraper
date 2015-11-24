"use strict";
var getDestination = require("../scrapers/default.js").getDestination;

describe("regular expression for links", function () {

  it("should return the links and the name", function () {
    var line = "[Madrid](/wiki/Madrid \"Madrid\") - [Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")";
    var result = getDestination(line);

    console.log(result);
  });


});
