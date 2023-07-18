const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://VishalGupta96644:CSAN2371@vishalcluster.tvkjxkj.mongodb.net/todolistDB")
    

const app = express();
const port = 3000 || process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");


const itemSchema = new mongoose.Schema({
    name : String
})
const Item = mongoose.model("Item",itemSchema);
const item1 = new Item({
    name : "Breakfast"
});
const item2 = new Item({
    name : "Lunch"
});
const item3 = new Item({
    name : "Dinner"
});
const defalutItems = [item1,item2,item3];


const listSchema = new mongoose.Schema({
    name : String,
    items : [itemSchema]
});

const List = mongoose.model("List",listSchema);


app.listen(port,function(){
    console.log("Server Started !!");
})


app.get("/",function(req,res){
    
    Item.find({}).then(function(items){
        
        if(items.length==0)
        {
            Item.insertMany(defalutItems).then(function(){
                console.log("Inserted Successfully !!") 
            }).catch(function(err){
                console.log(err);
            });
            res.redirect("/");
        }
        else{
            res.render("list",{listTitle:"Today",newListItems : items});
        }

    }).catch(function(err){
        console.log(err);
    });
    
});


app.get("/:customListName",function(req,res){

    const customListName = _.capitalize(req.params.customListName);             

    List.findOne({name : customListName}).then(function(list){

        if(!list)
        {
            const list = new List({
                name : customListName,
                items : defalutItems
            })
            list.save();
            res.redirect("/"+customListName);
        }
        else
        {
            res.render("list",{listTitle : list.name ,newListItems : list.items});
        }
    }).catch(function(err){
        console.log(err);
    })
    
})


app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name : itemName
    });

    if(listName == "Today")
    {
        item.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name : listName}).then(function(list){
            list.items.push(item);
            list.save();
            res.redirect("/"+listName);
        })
    }
    
})


app.post("/delete",function(req,res)
{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName == "Today")
    {
        Item.findByIdAndRemove(checkedItemId).then(function(){
            console.log("Wow Deleted !!");
        }).catch(function(err){
            console.log(err);
        });
        res.redirect("/");   
    }
    else
    {
        List.findOneAndUpdate({name : listName},{$pull : { items : {_id : checkedItemId}}}).then(function(){
            console.log("Deleted !!");
            res.redirect("/"+listName);
        }).catch(function(err){
            console.log(err);
        })
    }
    
})