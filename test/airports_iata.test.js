"use strict";
var airportsIata = require("../src/airports_iata.js");
var getAllAirportsByIata = airportsIata.getAllAirportsByIata;
var getAirportsByIata = airportsIata.getAirportsByIata;

var chai = require("chai");
var expect = chai.expect;

var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");


describe("airports_iata.js", function() {
  
  it("should get all the airports", function() {
    var iataLocalList = require("./fixtures/airports_iata.data.json"), i;

    for (i = 0; i < iataLocalList.length; i+=1) {
      iataLocalList[i]= "http://localhost:3000/" + iataLocalList[i];
    }
    getAllAirportsByIata(iataLocalList, function(err, airportsData) {
      var airportsSchema = require("../schema/airport_links.schema.json");
      var validateAirportsLinkSchema = ajv.compile(airportsSchema);
      var validAirportsLink = validateAirportsLinkSchema(airportsData);

      expect(validAirportsLink, _.get(validateAirportsLinkSchema, "errors[0].message")).to.be.true;
    });
  });

});
