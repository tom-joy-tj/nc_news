const db = require("../db/connection.js");


exports.selectTopics = () => {
    return db 
    .query("SELECT * FROM topics;")
    .then(({rows}) => {
        return rows;
    })
}

exports.selectArticlesByID = (chosenArticle) => {
    return db 
    .query(`SELECT author, title, article_id, body, topic, created_at, votes, article_img_url FROM articles where article_id = $1`, [chosenArticle])
    .then(({rows}) => {
        return rows;
    })
}
