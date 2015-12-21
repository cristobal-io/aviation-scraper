"use strict";

module.exports = function ($) {
  var scraper = "default";
  
  if ($("[id^='Scheduled_destinations_from']").length) {
    scraper = "table_with_origins";
  } else if ($(".sortable").hasClass("sortable")) {
    scraper = "table";
  } else if ($("center .wikitable").length) {
    scraper = "table_center";
  } else if (($(".mw-content-ltr h3")).length) {
    scraper = "default_variant";
  }

  return scraper;
};
