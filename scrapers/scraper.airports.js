"use strict";

module.exports = function ($) {
  var airportData = {
    "coordinates": {},
    "runway": {}
  };

  airportData.name = $(".infobox.vcard").find(".fn.org").text();
  airportData.nickname = $($(".infobox.vcard").find("span")[1]).text();
  airportData.website = $("th:contains('Website')").next("td").find("a").attr("href");
  airportData.iata = $(".vcard").find("[title='International Air Transport Association airport code']").next(".nickname").text();
  airportData.icao = $(".vcard").find("[title='International Civil Aviation Organization airport code']").next(".nickname").text();
  airportData.coordinates.latitude = $($(".vcard .geo-dms .latitude")[0]).text();
  airportData.coordinates.longitude = $($(".vcard .geo-dms .longitude")[0]).text();

  var headers = [],
    reduction = 0, j;

  $($(".vcard tr").find("table")[0]).find("th").map(function () {
      // add the reduction value so we have a headers with the proper length 
      // the headers using this map function would be 5, later at the loop 
      // we would use the reduction so it is only 4 like the values.
      // +-------------+------------+-------------+
      // |  Direction  |   Length   |   Surface   |
      // |             +------+-----+             |
      // |             | m    |  ft |             |
      // +----------------------------------------+
      // |   14L/32R   |1,502 |4,928|   Asphalt   |
      // +----------------------------------------+

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

  // in case we don't have headers there is no need to enter the loop.
  // if we enter without headers value, we would have an infinite loop.
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
