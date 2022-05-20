//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res) {

  var today = new Date();
  var currentDay = today.getDay();

  if( currentDay === 6 || currentDay === 0) {
    res.write("<h1>It is the weekend</h1>");
  } else {
    res.sendFile(__dirname + "/index.html");
  }

});

app.listen(8080, function(){
  console.log("Server started at port 8080.");
});
