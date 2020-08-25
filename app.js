//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
const mongoose=require("mongoose");
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema={
  name:String
};

const Item = mongoose.model("Item",itemsSchema);

const item1= new Item({
  name:"Welcome to your todolist"
});

const item2= new Item({
  name:"hit + button to add new item"
});

const item3= new Item({
  name:"<-- Hit this to delete an item"
});

const defaultitems =[item1,item2,item3];



app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){

        if(foundItems.length ===0){
        Item.insertMany(defaultitems, function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("succesfully added item into list");
        }
        });
        res.redirect("/");
    }
    else{
      const day = date.getDate();
      res.render("list", {listTitle: day, newListItems: foundItems});
    }



  });

  

});

app.post("/", function(req, res){

  //const item = req.body.newItem;

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName

  });
  item.save();
  res.redirect("/");


/*   if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  } */
});
app.post("/delete",function(req, res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("success in deletion");
      }
    });
    res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
