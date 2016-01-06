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

    for (var l = 1; l < $rowtable.length; l += 1) {
      var $rowTableContent = $($rowtable[l]).find("td");

      options.lenghtRow = $rowTableContent.length;

      for (var m = 0; m < options.lenghtRow; m += 1) {
        options.textHeader = $($headers[m]).text().toLowerCase();

        options.textTableContent = $($rowTableContent[m]).text() || options.defaultName;
        options.linkTableContent = $($rowTableContent[m]).find("a[href^='/']").attr("href") || options.defaultLink;

        options.textHeader = filterTextHeader(options);
        options.rowSpanAttribute = $($rowTableContent[m]).attr("rowspan");

        options.rowNumber = row.length;

        checkRowSpan(options);

        addAirport(options, row);
      }
    }
  });
  return row;
};

function filterTextHeader(options) {
  if (/destination/.test(options.textHeader)) {
    return "city";
  } else if (/airport/.test(options.textHeader)) {
    return "airport";
  } else if (/location/.test(options.textHeader)) {
    return "city";
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
    if (row[options.rowNumber-1] === undefined) {return;}
    // we are in the same row
    row[options.rowNumber - 1][options.textHeader] = {
      "name": options.textTableContent,
      "url": options.linkTableContent
    };
  } else {
    // we create a new row and add the city
    row.push(options.rowNumber);
    row[options.rowNumber] = {};
    row[options.rowNumber][options.textHeader] = {
      "name": options.textTableContent,
      "url": options.linkTableContent
    };
  }
  return row;
}
