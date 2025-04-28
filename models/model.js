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
    .then(( {rows} ) => {
        return rows;
    })
}

exports.selectArticles = () => {
    return db
    .query(`SELECT 
    a.author,
    a.title,
    a.article_id,
    a.topic,
    a.created_at,
    a.votes,
    a.article_img_url,
    COALESCE(COUNT(c.comment_id), 0) :: int AS comment_count
FROM 
    articles a
LEFT JOIN 
    comments c ON a.article_id = c.article_id
GROUP BY 
    a.article_id
ORDER BY 
    a.article_id`)
.then( ( {rows} ) => {
    return rows;
})
}
