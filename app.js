const express = require("express"); 
const app = express(); 

const { getAPI, getTopics, getArticlesByID } = require("./controllers/controller.js");

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID)

module.exports = app;