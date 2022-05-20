//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let items = ["Hit the gym", "Meet David", "Read a book"];

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {

  // create var day for output
  let day = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  // passing var from js into ejs (day -> dayOfWeek)
  res.render("list", {dayOfWeek: day.toLocaleString("en-US", options),
                      newListItems: items
                      });

});

app.post("/", function(req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});

app.listen(8080, function(){
  console.log("Server started at port 8080.");
});
