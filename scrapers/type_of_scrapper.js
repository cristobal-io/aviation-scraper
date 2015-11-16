"use strict";

module.exports = function ($) {
  var scraper = "default";
  
  debugger;
  if ($("[id^='Scheduled_destinations_from']").length) {
    scraper = "table_with_origins";
  } else if ($(".sortable").hasClass("sortable")) {
    scraper = "table";
  }

  return scraper;
};
