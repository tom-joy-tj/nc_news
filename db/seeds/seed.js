const db = require("../connection");
const topics = require("../data/test-data/topics");
const users = require("../data/test-data/users");

const { convertTimestampToDate } = require("../../db/seeds/utils");

const formatArticlesData = (articles) => {
  return articles.map(convertTimestampToDate);
};

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
      body TEXT,
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
    const topicInsertPromises = topicData.map((topic) => {
      const { slug, description, img_url } = topic;
      return db.query(
        `INSERT INTO topics (slug, description, img_url) VALUES ($1, $2, $3);`,
        [slug, description, img_url]
      );
    });
    return Promise.all(topicInsertPromises);
  })
  .then(() => {
    const userInsertPromises = userData.map((user) => {
      const { username, name, avatar_url } = user;
      return db.query(
        `INSERT INTO users (username, name, avatar_url) VALUES ($1, $2, $3);`,
        [username, name, avatar_url]
      );
    });
    return Promise.all(userInsertPromises);
  })
  .then(() => {
    const formattedArticles = formatArticlesData(articleData);
    const articleInsertPromises = formattedArticles.map((article) => {
      const { title, topic, author, body, created_at, votes, article_img_url } = article;
      return db.query(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [title, topic, author, body, created_at, votes, article_img_url]
      );
    });
    return Promise.all(articleInsertPromises);
  })
  .then(() => {
    const formattedComments = commentData.map(convertTimestampToDate);
    const commentInsertPromises = formattedComments.map((comment) => {
      const { body, votes, author, article_id, created_at } = comment;
      return db.query(
        `INSERT INTO comments (body, votes, author, article_id, created_at)
         VALUES ($1, $2, $3, $4, $5);`,
        [body, votes, author, article_id, created_at]
      );
    });
    return Promise.all(commentInsertPromises);
  });
};


module.exports = seed;


