const express = require("express"); 
const app = express(); 

const { getAPI, getTopics } = require("./controllers/controller.js");

app.get("/api", getAPI);

app.get("/api/topics", getTopics);


module.exports = app;