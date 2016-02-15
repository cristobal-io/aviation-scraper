"use strict";
var Joi = require("joi");

var schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  access_token: [Joi.string(), Joi.number()],
  birthyear: Joi.number().integer().min(1900).max(2013),
  email: Joi.string().email()
}).with("username", "birthyear").without("password", "access_token");

Joi.validate({
  username: "ab",
  birthyear: 1994
}, schema, function (err, value) {
  if (err) {throw err};
  console.log(value);
}); // err === null -> valid
