const db = require("../connection");
// const topics = require("../data/test-data/topics");
// const users = require("../data/test-data/users");

const format = require("pg-format");

const { convertTimestampToDate, createRef } = require("../../db/seeds/utils");



const seed = ({ topicData, userData, articleData, commentData }) => {
  return db.query(`DROP TABLE IF EXISTS comments`)  
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS articles`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS users`)
  })
  .then(() => {
    return db.query(`DROP TABLE IF EXISTS topics`)
  })
  .then(() => {
    return db.query(`CREATE TABLE topics (
      slug VARCHAR PRIMARY KEY, 
      description VARCHAR, 
      img_url VARCHAR(1000) );
      `);
  })
  .then(() => {
  return db.query(`CREATE TABLE users(
      username VARCHAR PRIMARY KEY, 
      name VARCHAR, 
      avatar_url VARCHAR(1000) );
      `);
  })
  .then(() => {
  return db.query(`CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY, 
      title VARCHAR, 
      topic VARCHAR REFERENCES topics(slug),
      author VARCHAR REFERENCES users(username), 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      body TEXT NOT NULL,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000) )
      `);
  })
  .then(() => {
  return db.query(`CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY, 
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR REFERENCES users(username),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP )
    `);
  })
  .then(() => {
const formattedTopics = topicData.map((topic => {
  return [topic.slug, topic.description, topic.img_url]}
  ));
  const insertTopicsQuery = format(
    `INSERT INTO topics (slug, description, img_url) 
    VALUES %L;`, formattedTopics
  );
  return db.query(insertTopicsQuery);
})

.then(() => {
  const formattedUsers = userData.map((user => {
    return [user.username, user.name, user.avatar_url]}
    ));
    const insertUsersQuery = format(
      `INSERT INTO users (username, name, avatar_url) 
      VALUES %L;`, formattedUsers
    );
    return db.query(insertUsersQuery);
  })

  .then(() => {
    const formattedArticles = articleData.map((article => {
      const legitArticle = convertTimestampToDate(article); // inside this formattedArtcles function we map articles to new legit version then invoke a utility finction on it to clean the date stamp 

      return [          //then we return a new array of 
        legitArticle.title, 
        legitArticle.topic, 
        legitArticle.author, 
        legitArticle.body, 
        legitArticle.created_at, //this is the key one as the date will now be cleaned by the utility function 
        legitArticle.votes, 
        legitArticle.article_img_url
      ];
    }));
    
    const insertArticlesQuery = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) 
        VALUES %L RETURNING *;`, formattedArticles
      );
      return db.query(insertArticlesQuery);
    })

    .then((result) => {
      //console.log(result.rows);
      const articlesRefObject = createRef(result.rows); //use the utility function on result.rows
      //console.log (articlesRefObject);
      const formattedComments = commentData.map((comment) => {
        const legitComment = convertTimestampToDate(comment)
        return [
          articlesRefObject[comment.article_title], 
          legitComment.body, 
          legitComment.votes, 
          legitComment.author, 
          legitComment.created_at
        ]
      });
      const insertedCommentQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES %L`, formattedComments
      )
      return db.query(insertedCommentQuery)
    })
    .then(() => {
      //console.log("Seed complete");
    });
};




module.exports = seed;


