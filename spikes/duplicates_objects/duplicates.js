"use strict";

var duplicateObject = require("./duplicateObject.json");
var _ = require("lodash");

var noDuplicates = _.map(_.groupBy(duplicateObject, function (value) {
  return value.name;
}), function (grouped) {
  return grouped[0];
});

console.log(noDuplicates);//eslint-disable-line no-console
