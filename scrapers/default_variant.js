$(".mw-content-ltr h3").map(function () {
  var destinations = $(this).next("ul");
  console.log(JSON.stringify(destinations.text(), null, 2));
  return console.log(JSON.stringify($(this).find(".mw-headline").text(), null, 2));
})
