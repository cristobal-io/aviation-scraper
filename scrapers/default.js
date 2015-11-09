"use strict";

module.exports = function ($) {
  debugger;
  var destinations = {};
  var from;

  $(".mw-content-ltr ul li").each(function () {
    console.log($(this).attr('class'));
    if ($(this).attr("class") == "toclevel-1") {
      console.log("toclevel-1");
      return;}
    var lines = $(this).text().split("\n");

    if (lines.length > 1) {
      from = lines[0];
    } else {
      var links = $(this).find("a");

      destinations[from] = {
        city: {
          name: links[0].attribs.title, //links.get(0).textContent,
          url: links[0].attribs.href
        },
        airport: {
          name: links[1].attribs.title, //links.get(1).textContent,
          url: links[1].attribs.href
        }
      };
    }
  });

  console.log(JSON.stringify(destinations, null, 2));
  return destinations;
  // $(".mw-category li a").map(function () {
  //   return {
  //     name: $(this).text().replace(/ destinations$/, ""),
  //     destinationsLink: $(this).attr("href")
  //   };
  // }).get();
};
