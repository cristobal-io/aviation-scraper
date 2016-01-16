"use strict";

module.exports = function ($) {

  var row = [];

  $(".toccolours").map(function () {

    var $headers = $(this).find("th");
    var $rowtable = $(this).find("tr");
    // bermi: is this the proper way of declaring variables?
    var l, $rowTableContent, m, textHeader, textTableContent, linkTableContent, rowNumber;

    for (l = 1; l < $rowtable.length; l += 1) {
      $rowTableContent = $($rowtable[l]).find("td");

      for (m = 0; m < $rowTableContent.length; m += 1) {
        textHeader = $($headers[m]).text().toLowerCase();
        textTableContent = $($rowTableContent[m]).text();
        linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href");

        if (textHeader === "airport" || textHeader === "city") {
          rowNumber = l-1;

          if (row[rowNumber] === undefined) {
            row.push(rowNumber);
            row[rowNumber] = {};
          }
          row[rowNumber][textHeader] = {
            "name": (textTableContent),
            "url": (linkTableContent)
          };
        }

      }

    }
  });

  return row;
};
