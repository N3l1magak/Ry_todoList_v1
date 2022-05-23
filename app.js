//jshint esversion: 6

// Init npm for use
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

// Config

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin-reynolds:1995222@todolistcluster.2vpsn.mongodb.net/todolistDB");

// create var day for output
//
// let day = new Date();
//
// let options = {
//   weekday: "long",
//   day: "numeric",
//   month: "long"
// };
//
// const time = day.toLocaleString("en-US", options);

// Create item schema for MongoDB
const itemSchema = {
  name: {
    type: String,
    required: true
  }
};

const Item = mongoose.model("Item", itemSchema);

// Create list schema for MongoDB
const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

// Initialize sample instruction items
const item_1 = new Item({
  name: "This is your todolist"
});

const item_2 = new Item({
  name: "Press + for adding new items"
});

const item_3 = new Item({
  name: "Press this check box to delete item"
});

let defaultItems = [item_1, item_2, item_3];


// Define action for client when root is accessed
app.get("/", function(req, res) {

  Item.find(function(err, docs){
    // determine if the site needs to initialize by checking if items avalible in DB
    if (docs.length === 0) {
      // if nothing in DB, initialize
      Item.insertMany(defaultItems, function(err){
        if(err) {
          console.log(err);
        } else {
          console.log("Initialize instruction items successful.");
        }
      });
      // refresh page
      res.redirect("/");
    } else {
      // passing title and items to ejs file
      res.render("list", {listTitle: "Today",
                          newListItems: docs
                          });
    }
  });

});

// Define action for client when button clicked
app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  // if is root page
  if(listName == "Today") {
    // update DB
    item.save();
    // refresh page
    res.redirect("/");
  } else {
    // if isn't root page, update item inside the specific list
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

// Define action when deleting item
app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  // If root page
  if(listName == "Today") {
    // Delect item from DB and refresh page
    Item.deleteOne({_id: checkedItemId}, function(err){
      if(err) {
        console.log(err);
      } else {
        console.log("successful deleted checked item.");
      }
    });
    res.redirect("/");
  } else {
    // If isn't root page, find list name first, then item id, then delete
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, result){
      if(!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

// Define when custom page accessed
app.get("/:customListName", function(req, res){
  List.findOne({ name: _.capitalize(req.params.customListName) }, function(err, foundList){
    if(!err){
      if(!foundList) {
        // if no list found, create
        const list = new List({
          name: _.capitalize(req.params.customListName),
          items: defaultItems
        });
        list.save();
        res.redirect("/" + _.capitalize(req.params.customListName));
      } else {
        // otherwise show the list
        res.render("list", {listTitle: foundList.name,
                            newListItems: foundList.items
                            });
      }
    }
  });

});

app.listen(8080, function(){
  console.log("Server started at port 8080.");
});
