const express = require("express")


const app = express()


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/server.html")
})

app.get("/new/*", function(req, res) {
    var site = req.params[0]

    var odpoved = {
        "original_url":site,
        "short_url":"https://api-projects-ale5ak.c9users.io/DODELAT"
    }
    res.send(odpoved)
    console.log(odpoved)
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("spusteno")
})