"use strict";

module.exports = function ($) {
  var airportData = {
    "coordinates": {},
    "runway": {
      "length": {}
    }
  };

  airportData.iata = $(".vcard").find("[title='International Air Transport Association airport code']").next(".nickname").text();
  airportData.icao = $(".vcard").find("[title='International Civil Aviation Organization airport code']").next(".nickname").text();
  airportData.coordinates.latitude = $($(".vcard .geo-dms .latitude")[0]).text();
  airportData.coordinates.longitude = $($(".vcard .geo-dms .longitude")[0]).text();

  $(".vcard tr").find("table").map(function () {
    // console.log($(this).text());
  });

  var $headers;
  
  $($(".vcard tr").find("table")[0]).find("tr").map(function () {
    
    $headers = $(this).find("th").map(function () {

    });
    // console.log($(this).text());
  })

  return airportData;
};
