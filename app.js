const express = require("express"); 
const app = express(); 

const { getAPI, getTopics, getArticlesByID } = require("./controllers/endpoint.controller.js");

const { handlePsqlError, handleCustomError, handle500Error } = require("./controllers/error.controller.js");

app.use(express.json());

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID)




app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Endpoint not found!" });
  });

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handle500Error);

module.exports = app;