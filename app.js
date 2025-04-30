const express = require("express"); 
const app = express(); 

const { getAPI, getTopics, getArticlesByID, getArticles, getCommentsByArticle, postCommentByArticle, patchArticlesByID, removeCommentByID, getUsers } = require("./controllers/endpoint.controller.js");

const { handlePsqlError, handleCustomError, handle500Error } = require("./controllers/error.controller.js");

app.use(express.json());

app.get("/api", getAPI);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesByID);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.patch("/api/articles/:article_id", patchArticlesByID)

app.delete("/api/comments/:comment_id", removeCommentByID)

app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Endpoint not found!" });
  });

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handle500Error);

module.exports = app;