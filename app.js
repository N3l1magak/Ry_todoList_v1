//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.get("/", function(req, res) {

  // create var day for output
  var day = "";

  switch(new Date().getDay()) {
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
  }

  // passing var from js into ejs (day -> dayOfWeek)
  res.render("list", {dayOfWeek: day});

});

app.listen(8080, function(){
  console.log("Server started at port 8080.");
});
