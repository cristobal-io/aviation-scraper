// todo: add big explanation with all the cases we are trying to solve due to
// inconsistencies of the data.
"use strict";

module.exports = function ($) {

  var row = [];

  $(".sortable").map(function () {

    var $headers = $(this).find("th");
    var $rowtable = $(this).find("tr");
    var options = {
      "defaultName": "",
      "defaultLink": "",
      "sharedAirport": 0,
      "numberMissingCells": 0,
      "rowSpanAttribute": 0,
      "lenghtRow": 0
    };
    // bermi: is this the way of not having the var inside loops?
    var $rowTableContent, l, m;

    for (l = 1; l < $rowtable.length; l += 1) {
      // todo: no var inside for loop
      // check eslint to capture this.
      $rowTableContent = $($rowtable[l]).find("td");

      options.lenghtRow = $rowTableContent.length;

      for (m = 0; m < options.lenghtRow; m += 1) {
        options.textHeader = $($headers[m]).text().toLowerCase();

        options.textTableContent = $($rowTableContent[m]).text() || options.defaultName;
        options.linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href") || options.defaultLink;

        options.textHeader = getTextHeader(options);
        options.rowSpanAttribute = $($rowTableContent[m]).attr("rowspan");

        options.rowPosition = row.length;

        checkRowSpan(options);

        addAirport(options, row);
      }
    }
  });
  return row;
};

function getTextHeader(options) {
  if (/destination|location/.test(options.textHeader)) {
    return "city";
  } else if (/airport/.test(options.textHeader)) {
    return "airport";
  } else {
    return options.textHeader;
  }
}

function checkRowSpan(options) {
  if (options.rowSpanAttribute) {
    options.numberMissingCells += 1;
  }
  return options;
}

function addAirport(options, row) {
  if (options.textHeader === "airport" || options.textHeader === "city") {
    addMissingHeader(options);
    assignDefaultValues(options);

    assignRow(row, options);
  }
}

function addMissingHeader(options) {
  if (options.sharedAirport > 1 && options.textHeader === "city") {
    options.lenghtRow = options.lenghtRow + options.numberMissingCells;
    options.sharedAirport -= 1;
  } else if (options.sharedAirport === 1) {
    // cleaning the default values and counters to avoid side-effects.
    options.defaultName = "", options.defaultLink = "";
    options.sharedAirport = 0, options.numberMissingCells = 0;
  }
  return options;
}

function assignDefaultValues(options) {
  if (options.rowSpanAttribute) {
    options.defaultName = options.textTableContent;
    options.defaultLink = options.linkTableContent;
    options.sharedAirport = options.rowSpanAttribute;
  }
  return options;
}

function assignRow(row, options) {
  if (options.textHeader === "airport") {
    if (row[options.rowPosition-1] === undefined) {return;}
    // we are in the same row
    row[options.rowPosition - 1][options.textHeader] = {
      "name": options.textTableContent,
      "url": options.linkTableContent
    };
  } else {
    // we create a new row and add the city
    row.push(options.rowPosition);
    row[options.rowPosition] = {};
    row[options.rowPosition][options.textHeader] = {
      "name": options.textTableContent,
      "url": options.linkTableContent
    };
  }
  return row;
}
