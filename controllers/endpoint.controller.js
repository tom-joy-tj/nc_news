const { selectTopics, selectArticlesByID, selectArticles, selectCommentsByArticle } = require("../models/model.js");
const endpointsJson = require("../endpoints.json");

exports.getAPI = (req, res) => {
    res.status(200).send({ endpoints : endpointsJson })
};

exports.getTopics = (req, res, next) => {
    return selectTopics() 
    .then((topics) => {
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticlesByID = (req, res, next) => {

    let chosenArticle = req.params.article_id;

    return selectArticlesByID(chosenArticle) 
    .then((article) => {
        if (article.length === 0) {
            return Promise.reject( { status: 404, msg: `No article found at Article ID: ${chosenArticle}!`})
        } 
        else {
            res.status(200).send( { article } )
        }
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then((articles) => {
        if(articles.length === 0) {
            return Promise.reject( { status: 404, msg: "No articles found" } )
        }
        else {
            res.status(200).send( { articles } )
        }
    })
    .catch((err) => {
        next(err);
    });
};

exports.getCommentsByArticle = (req, res, next) => {
    
    let chosenArticle = req.params.article_id;

    return selectCommentsByArticle(chosenArticle)
    .then((comments) => {
        if(comments.length === 0) {
            return Promise.reject( { status: 404, msg: `No comments found for Article: ${chosenArticle}, try writing one :)` } )
        }
        else {
            res.status(200).send ( { comments } )
        }
    })
    .catch((err) => {
        next(err);
    });
};
