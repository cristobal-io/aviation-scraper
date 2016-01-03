"use strict";

module.exports = function ($) {
  var scraper = "default";
  
  if ($(".sortable").hasClass("sortable")) {
    scraper = "table";
  } else if ($("center .wikitable").length) {
    scraper = "table";
  } else if (($(".mw-content-ltr h3")).length) {
    scraper = "default";
  } else if (($(".toccolours")).length) {
    scraper = "table_toccolours";
  }

  return scraper;
};
