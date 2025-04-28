const { selectTopics, selectArticlesByID } = require("../models/model.js");
const endpointsJson = require("../endpoints.json");

exports.getAPI = (req, res) => {
    res.status(200).send({ endpoints : endpointsJson })
};

exports.getTopics = (req, res) => {
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
            return Promise.reject( { status: 404, msg: "Article not found!"})
        } else {
            res.status(200).send({article})
        }
    })
    .catch((err) => {
        next(err);
    });
};



