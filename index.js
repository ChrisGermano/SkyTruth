'use strict';

const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const engines = require('consolidate');
const port = process.env.PORT || 9001;

const storedConfig = require('./config.js');

const config = {}; //External variables not for Git, credentials etc

app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index.html", { title: "Home"});
});

app.listen(port, () => {
  console.log('Listening on ' + port)
})
