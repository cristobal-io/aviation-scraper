"use strict";

module.exports = function ($) {
  var scraper = "default";
  
  debugger;
  if ($(".toccolours").hasClass("jquery-tablesorter")) {
    scraper = "table";
    console.log("jquery tablesorter called");
  }
  if ($(".wikitable").hasClass("wikitable")) {
    scraper = "table";
  }

  return scraper;
};
