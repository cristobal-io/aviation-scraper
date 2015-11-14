"use strict";

module.exports = function ($) {
  var scraper = "default";
  
  debugger;
  if ($("[id^='Scheduled']").length) {
    scraper = "table_with_origins";
    console.log("jquery tablesorter called");
  } else if ($(".wikitable").hasClass("wikitable")) {
    scraper = "table";
  }

  return scraper;
};
