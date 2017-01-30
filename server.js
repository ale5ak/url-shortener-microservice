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


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/server.html")
  
  
})

app.get("/new/*", function(req, res) {
    var site = req.params[0]

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        var collection = db.collection('urlshortener')
        Promise.resolve(collection.updateOne({"site":site}, {"site":site}, {upsert:true}, function(err, result) {}))
            .then(collection.findOne({"site":site}, function(err, result) {
                var odpoved = {
                    "original_url":site,
                    "short_url":"http://nodeweb.local/" + result._id
                }
                res.send(odpoved)
                console.log(result)
            }))
        //collection.find().toArray(function(err, result) {console.log(result)} )
        db.close();
    });
})

app.get("/*", function (req, res) {
    var id = new mongo.ObjectID(req.params[0])

    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");

        var collection = db.collection('urlshortener')
        collection.findOne({"_id":id}, function(err, result) {
            console.log(result.site)
            res.redirect(result.site)
        })
    })
})

app.listen(3000, function(){
    console.log("spusteno")
})