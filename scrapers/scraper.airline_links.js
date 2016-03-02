"use strict";

module.exports = function ($) {
  var airline = [];

  $("table.sortable").find("tr").map(function () {
    var $airline = $(this).find("td"),
      airlineData = {},
      iata = $($airline[0]).text(),
      icao = $($airline[1]).text(),
      airlineName = $($airline[2]).text(),
      airlineLink = $($airline[2]).find("a").attr("href"),
      callSign = $($airline[3]).text(),
      country = $($airline[4]).text();

    if (!/wiki/.test(airlineLink)) {
      airlineLink = "";
    }
    if (airlineName || airlineLink) {
      airlineData["airline"] = {};
      addDatatoAirline(airlineName, "name", airlineData.airline);
      addDatatoAirline(airlineLink, "link", airlineData.airline);
    }
    addDatatoAirline(iata, "IATA", airlineData);
    addDatatoAirline(icao, "ICAO", airlineData);
    addDatatoAirline(callSign, "CallSign", airlineData);
    addDatatoAirline(country, "Country", airlineData);
    if (Object.keys(airlineData).length) {
      airline.push(airlineData);
    }
  });
  return airline;
};

// Bermi: how to improve this function. Do I need to pass the object to modify it?
// I thought this could be done as a closure, I understand that in order to do it
// this way, I have to return the function execution. Am I right?
function addDatatoAirline(data, dataName, airlineObject) {
  if (data) {
    airlineObject[dataName] = data;
  }
  return airlineObject;
}
