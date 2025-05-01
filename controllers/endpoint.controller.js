const { selectTopics, selectArticlesByID, selectArticles, selectCommentsByArticle, insertCommentByArticle, updateArticlesByID, deleteCommentByID, selectUsers } = require("../models/model.js");
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

    const chosenArticle = req.params.article_id;

    return selectArticlesByID(chosenArticle) 
    .then((article) => {
        if (!article) {
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

    const validQueries = ["article_id", "title", "topic", "author", "created_at", "body", "votes", "article_img_url"] //greenlist
    const validOrders = ["ASC", "DESC"]
    const validTopics = ["mitch", "cats"]

    let sortByQuery = "created_at" //this is the default sort
    let orderQuery = "DESC"  //this is the default order of the sort
    let chosenTopic = null 

    if (req.query.sort_by && validQueries.includes(req.query.sort_by)) {
        sortByQuery = req.query.sort_by
    }
    if (req.query.order && validOrders.includes(req.query.order.toUpperCase())) {
        orderQuery = req.query.order.toUpperCase()
    }
    if (req.query.topic && validTopics.includes(req.query.topic)) {
        chosenTopic = req.query.topic
    }

    return selectArticles(sortByQuery, orderQuery, chosenTopic)
    .then((articles) => {
        if(articles.length === 0) {
            res.status(200).send( { msg: "No articles found - run seed and try again" } )
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
    
    const chosenArticle = req.params.article_id;

    selectArticlesByID(chosenArticle)
    .then((article) => {
        if (!article) {
            return Promise.reject( { status: 404, msg: `Cannot find Article: ${chosenArticle}!` } )
        }
        return selectCommentsByArticle(chosenArticle)
    })
        .then((comments) => {
            if(comments.length === 0) {
            res.status(200).send( { msg: `Article ID ${chosenArticle} has no comments!` } )
            }
            else {
            res.status(200).send ( { comments } )
            }
        })
        .catch((err) => {
            next(err)
        });
};

exports.postCommentByArticle = (req, res, next) => {

    const chosenArticle = req.params.article_id;
    const userName = req.body.username;
    const newComment = req.body.body;
    const validUsers = ["butter_bridge", "icellusedkars", "rogersop", "lurker"]

    if(!userName || !newComment) {
        return res.status(400).send( { msg: "Missing username or comment to post!" } )
    }
    if (!validUsers.includes(userName)) {
        return res.status(400).send( { msg: "Username invalid! Check you have entered username correctly or create new user account" } )
    }
    insertCommentByArticle(chosenArticle, userName, newComment)
    .then((postedComment) => {
        if (postedComment.length === 0) {
            return Promise.reject( { status: 404, msg: "Article not found!" } )
        }
        res.status(201).send( { comment : postedComment[0].body } )
    })
    .catch((err) => {
        next(err)
    });
};

exports.patchArticlesByID = (req, res, next) => {

    const chosenArticle = req.params.article_id
    const updateVotes = req.body.inc_votes

    if (!chosenArticle || !updateVotes) {
        return res.status(400).send( { msg: "Must include a valid article_ID and valid number to add"})
    }
    
    updateArticlesByID(chosenArticle, updateVotes)
    .then((updatedArticle) => {
        res.status(200).send( { article: updatedArticle } )
    })
    .catch((err) => {
        next(err)
    });
};

exports.removeCommentByID = (req, res, next) => {

    const chosenComment = req.params.comment_id

    deleteCommentByID(chosenComment)
    .then(( rowCount ) => {

        if (rowCount === 0) {
            return Promise.reject( { status: 404, msg: `Comment ${chosenComment} did not exist or was already deleted!`} )
        }
        else if (rowCount === 1) {
            res.status(204).send()
        }
        else { 
            return Promise.reject( { status: 500, msg: "Unexpected error!" } )
        };
    })
    .catch((err) => {
        next(err)
    });
};

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        if (users.length === 0) {
            res.status(200).send( { msg: "No users found - run seed and try again!" } )
        }
        else { 
            res.status(200).send( { users } )
        }
    })
    .catch((err) => {
        next(err);
    });
};
