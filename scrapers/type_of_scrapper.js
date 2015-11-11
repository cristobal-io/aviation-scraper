"use strict";

module.exports = function ($) {
  debugger;
  var scraper = "default";

  if ($(".wikitable").hasClass("wikitable")) {
    console.log("wikitable");
    scraper = "table";
  }
  return scraper;
};
