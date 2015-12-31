"use strict";

module.exports = function ($) {

  // var destinations = [];
  var row = [];

  $(".sortable").map(function () {

    var $headers = $(this).find("th");
    var $tableContent = $(this).find("tr td");

    for (var i = 0, j = 0, k = 0; i < $tableContent.length; i += 1, j += 1) {
      var textHeader = $($headers[j]).text().toLowerCase();
      var textTableContent = $($tableContent[i]).text();
      var linkTableContent = $($tableContent[i]).find("a[href^='/']").attr("href");

      if (textHeader === "airport" || textHeader === "city") {

        if (row[k] === undefined) {
          row.push(k);
          row[k] = {};
        }
        row[k][textHeader] = {
          "name": (textTableContent),
          "url": (linkTableContent)
        };
      }
      if (j > $headers.length - 2) {
        j = -1;
        k += 1;
      }
    }
    // destinations.push(row);
  });

  return row;
};
