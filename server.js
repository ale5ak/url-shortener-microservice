const express = require("express")
const app = express()
const Promise = require("bluebird");

Promise.promisifyAll(require("mongodb"));

const mongo = require('mongodb')
var MongoClient = mongo.MongoClient
  , assert = require('assert');
 
// Connection URL
var url = 'mongodb://localhost:27017';
// Use connect method to connect to the Server 

var expression = /^(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
var regex = new RegExp(expression);


var database
var collection
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    //asign the database to a variable so we can close it when needed -> database.close()
    database = db

    collection = db.collection('urlshortener')
})

app.get('/', function (req, res) {
  res.sendFile(__dirname + "/server.html")
  
})

app.get("/new/*", function(req, res) {
    var site = req.params[0]

    if (!site.match(regex)) {
        res.end("expression is invalid")
    } else {
        Promise.resolve(collection.updateOne({"site":site}, {"site":site}, {upsert:true}, function(err, result) {}))
            .then(collection.findOne({"site":site}, function(err, result) {
                var odpoved = {
                    "original_url":site,
                    "short_url":"http://nodeweb.local/" + result._id
                }
                res.send(odpoved)
            }))
        collection.find().toArray(function(err, result) {console.log(result)} )
    }
})

app.get('/favicon.ico', function(req, res) {
    res.status(204);
});

app.get("/*", function (req, res) {
    var id = new mongo.ObjectID(req.params[0])
    collection.findOne({"_id":id}, function(err, result) {
            res.redirect(result.site)
    })
})

app.listen(3000, function(){
    console.log("running")
})