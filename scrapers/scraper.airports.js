"use strict";

module.exports = function ($) {
  var airportData = {
    "coordinates": {},
    "runway": {}
  };

  airportData.iata = $(".vcard").find("[title='International Air Transport Association airport code']").next(".nickname").text();
  airportData.icao = $(".vcard").find("[title='International Civil Aviation Organization airport code']").next(".nickname").text();
  airportData.coordinates.latitude = $($(".vcard .geo-dms .latitude")[0]).text();
  airportData.coordinates.longitude = $($(".vcard .geo-dms .longitude")[0]).text();

  var headers = [],
    reduction = 0, j;

  $($(".vcard tr").find("table")[0]).find("th").map(function () {
    if ($(this).attr("colspan")) {
      reduction += 1;
    }
    headers.push($(this).text());
  });

  var content = [];

  $($(".vcard tr").find("table")[0]).find("td").map(function () {
    content.push($(this).text());
  });

  var runwayContent = {}, runway = [];

  if (headers.length) {
    for (j = 0; j < content.length; j+=headers.length - reduction) {
      runwayContent = {};
      runwayContent[headers[0]] = content[j + 0];
      runwayContent[headers[3]] = content[j + 1];
      runwayContent[headers[4]] = content[j + 2];
      runwayContent[headers[2]] = content[j + 3];

      runway.push(runwayContent);
    }
  }
  airportData.runway = runway;
  return airportData;
};
