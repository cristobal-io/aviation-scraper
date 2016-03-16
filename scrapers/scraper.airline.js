"use strict";
var _ = require("lodash");

module.exports = function ($) {
  var OperatingBases = getOperatingBases($, $(".infobox.vcard"));
  var hubs = getHubs($, $(".infobox.vcard"));

  var result = {
    "name": $(".infobox.vcard").find(".org").text(),
    "logoLink": $(".infobox.vcard").find("img").attr("src"),
    "IATA": $($(".infobox.vcard").find("tr").find("table").find("td")[0]).text(),
    "ICAO": $($(".infobox.vcard").find("tr").find("table").find("td")[1]).text(),
    "Callsign": $($(".infobox.vcard").find("tr").find("table").find("td")[2]).text(),
    "OperatingBases": OperatingBases,
    "hubs": hubs,
    "website": $(".infobox.vcard").find("tr").find("th:contains('Website')").next("td").find("a").attr("href")
  };

  return dropFalseValues(result);

};


function getOperatingBases($, $self) {
  var bases = [];

  $($self).find("th:contains('Operating bases')").next("td").find("a").map(function () {
    bases.push({
      "name": $(this).text(),
      "link": $(this).attr("href")
    });
  });
  return bases.length ? bases : null;
}

function getHubs($, $self) {
  var hubs = [];

  $($self).find("th:contains('Hubs')").next("td").find("a").map(function () {
    hubs.push({
      "name": $(this).text(),
      "link": $(this).attr("href")
    });

  });
  return hubs.length ? hubs : null;
}

function dropFalseValues(obj) {
  var result = _.reduce(obj, function (result, value, key) {
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});

  return _.size(result) ? result : false;
}
