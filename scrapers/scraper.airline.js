"use strict";

module.exports = function ($) {
  var OperatingBases = getOperatingBases($, $(".infobox.vcard"));
  var hubs = getHubs($, $(".infobox.vcard"));
  
  // with this conditional, we only return results for the tipical box
  // with the right information.
  if ($(".infobox.vcard").find(".org").text()) {
    return {
      "name": $(".infobox.vcard").find(".org").text(),
      "logoLink": $(".infobox.vcard").find("img").attr("src"),
      "IATA": $($(".infobox.vcard").find("tr").find("table").find("td")[0]).text(),
      "ICAO": $($(".infobox.vcard").find("tr").find("table").find("td")[1]).text(),
      "Callsign": $($(".infobox.vcard").find("tr").find("table").find("td")[2]).text(),
      "OperatingBases": OperatingBases,
      "hubs": hubs,
      "website": $(".infobox.vcard").find("tr").find("th:contains('Website')").next("td").find("a").attr("href")
    };
  } else {
    return;
  }

};


function getOperatingBases($, $self) {
  var bases = [];

  $($self).find("th:contains('Operating bases')").next("td").find("a").map(function () {
    bases.push({
      "name": $(this).text(),
      "link": $(this).attr("href")
    });
  });
  return bases;
}

function getHubs($, $self) {
  var hubs = [];

  $($self).find("th:contains('Hubs')").next("td").find("a").map(function () {
    hubs.push({
      "name": $(this).text(),
      "link": $(this).attr("href")
    });

  });
  return hubs;
}
