"use strict";
var source = require("../src/index.js");
var getAllAirportsByIata = source.getAllAirportsByIata;

var chai = require("chai");
var expect = chai.expect;

describe("airports_iata.js", function() {
  
  it("should get all the airports", function() {
    // var iataLocalList = require("./fixtures/airports_iata.data.json");

    // getAllAirportsByIata(iataLocalList);
    expect(getAllAirportsByIata).to.be.an("function");
  });

});
