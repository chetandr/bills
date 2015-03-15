var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
var json2csv = require('json2csv');
var fs =require('fs');

var moment = require('moment-timezone');
moment().tz("America/Los_Angeles").format();

// define the paths for Scripts/partials/js etc
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/partials", express.static(__dirname + '/partials'));

// define the root for the single page.
app.get('/', function(req, res){
  res.sendfile("index.html");
});


app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// Define the port
app.listen(9080);

