"use strict";

// Mocha
var chai = require("chai");
var expect = chai.expect;

var Ajv = require("ajv");
var ajv = Ajv();

var _ = require("lodash");

var airlines = require("./fixtures/airlines.json");
var airlineJs = require("../src/airline.js");
var getAirlineData = airlineJs.getAirlineData;
var BASE_URL = "http://localhost:3000/";

describe("airline.js\n", function() {
  
  describe("getAirlineData", function() {
    
    it("should return a valid data schema", function (done) {
      var airlineDefaultSchema = require("../schema/airline.schema.json");
      var validateAirlineSchema = ajv.compile(airlineDefaultSchema);

      getAirlineData(BASE_URL + airlines[0], function(err, data) {
        // Bermi, this is really extrange, it gets the error from what I am calling inside
        // the expect error.
        if (err) {console.log(err);}
        // console.log(JSON.stringify(data,null,2));
        var validAirline = validateAirlineSchema([data]);

        // console.log(JSON.stringify(validateAirlineSchema.errors,null,2));
        expect(validAirline, _.get(validateAirlineSchema, "errors[0].message")).to.be.true;
        done();
      });
    });
  });
});
