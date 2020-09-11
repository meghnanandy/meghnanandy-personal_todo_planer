const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-meghna:dbmeghna@cluster0.znt8y.mongodb.net/todolist", { useNewUrlParser: true });

//Notepad


//schema for work,home,other
const homeSchema = {
    name: String
};
const workSchema = {
    name: String
};
const otherSchema = {
    name: String
};

//model  home,work,other
const Home = mongoose.model("Home", homeSchema);
const Work = mongoose.model("Work", workSchema);
const Other = mongoose.model("Other", otherSchema);

//new document loaded as soon as this is executed
const item1 = new Home({
    name: "Welcome to your to do list add your home works!"
});
const item2 = new Home({
    name: "Clean Kitchen"
});
const item3 = new Home({
    name: "Gardning"
});
const item4 = new Work({
    name: "Welcome to your to do list add your Office works!"
});
const item5 = new Work({
    name: "Meeting at 4pm"
});
const item6 = new Work({
    name: "Report submission"
});
const item7 = new Other({
    name: "Welcome to your to do list enter other plans to be done!"
});
const item8 = new Other({
    name: "Coffee with JK"
});
const item9 = new Other({
    name: "Renew car insurance"
});

//store in default array new documents
const homearray = [item1, item2, item3];
const workarray = [item4, item5, item6];
const otherarray = [item7, item8, item9];


//get route for home page
app.get("/", function (req, res) {

    res.render("home");
});
//get route for work page
app.get("/work", function (req, res) {
    Work.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Work.insertMany(workarray, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.redirect("/work");
        }
        else {
            res.render('list', { listTitle: "Work", newListItem: foundItems });
        }


    });
});
//get route for home page
app.get("/home", function (req, res) {
    Home.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Home.insertMany(homearray, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.redirect("/home");
        }
        else {
            res.render('list', { listTitle: "Home", newListItem: foundItems });
        }


    });


});

//get route for other page
app.get("/other", function (req, res) {
    Other.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Other.insertMany(otherarray, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("success");
                }
            });
            res.redirect("/other");
        }
        else {
            res.render('list', { listTitle: "Others", newListItem: foundItems });
        }


    });

});
//post route for adding work,home,other
app.post("/work", function (req, res) {
    const itemName = req.body.newItem;
    if (req.body.list === "Work") {
        const item = new Work({
            name: itemName
        });
        item.save();
        res.redirect("/work");
    }

    else if (req.body.list === "Home") {
        const item = new Home({
            name: itemName
        });
        item.save();
        res.redirect("/home");
    }
    else {
        const item = new Other({
            name: itemName
        });
        item.save();
        res.redirect("/other");

    }

});
//post route to delete
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Work") {
        Work.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {

                res.redirect("/work");
            }
        });
    }
    else if (listName === "Home") {
        Home.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {

                res.redirect("/home");
            }
        });
    }
    else {
        Other.findByIdAndRemove(checkedItemId, function (err) {
            if (!err) {

                res.redirect("/other");
            }
        });
    }

});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server started successfully")
});
