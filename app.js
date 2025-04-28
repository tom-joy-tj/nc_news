const express = require("express"); 
const app = express(); 

const { getAPI } = require("./controllers/controller.js");


app.get("/api", getAPI);

module.exports = app;