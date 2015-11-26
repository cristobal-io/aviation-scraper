"use strict";
var getDestination = require("../scrapers/default.js").getDestination;
var chai = require("chai");
var expect = chai.expect;

chai.use(require("chai-json-schema"));

describe("getDestination function ", function () {
  var result;

  var destinationSchema = {
    "title": "destination schema v1",
    "type": "object",
    "required": ["city", "airport"],
    "properties": {
      "city": {
        "type": "object",
        "minItems": 1,
        "uniqueItems": true,
        "required": ["name", "url"],
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        },
        "items": {
          "type": "string"
        }
      },
      "airport": {
        "type": "object",
        "minItems": 1,
        "uniqueItems": true,
        "required": ["name", "url"],
        "properties": {
          "name": {
            "type": "string"
          },
          "url": {
            "type": "string"
          }
        },
        "items": {
          "type": "string"
        }
      }
    }
  };

  beforeEach(function () {
    var line = "[Madrid](/wiki/Madrid \"Madrid\") - [Madrid Barajas Airport](/wiki/Madrid_Barajas_Airport \"Madrid Barajas Airport\")";

    return result = getDestination(line);
  });

  it("returns an object", function () {
    expect(result).to.be.an("object");
  });

  it("verify the object's structure", function () {
    // Object.keys(result).forEach(function (element, index) {
    //   console.log("index: %s", index);
    //   console.log("element: %s", element);
    //   console.log(result[element]);
    // });

    expect(result).to.be.jsonSchema(destinationSchema);
  });


});
