const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data"); 
const request = require("supertest"); 
const app = require("../app.js"); 
require("jest-sorted");

beforeEach(() => {   
  return seed(data);   
});

afterAll(() => {  
  return db.end(); 
});

describe("All invalid endpoints should return 404, Endpoint not found", () => {
  test("404: Responds with an error message for all invalid endpoints", () => {
    return request(app)
      .get("/api/invalidendpoint")
      .expect(404)
      .then( ( {body} ) => {
      expect(body.msg).toBe("Endpoint not found!")
      })
  });
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects which each have slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then( ( {body} ) => {
        expect(Array.isArray(body.topics)).toBe(true)
        expect(body.topics).toHaveLength(3)
        body.topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug")
          expect(topic).toHaveProperty("description")
        })
      });
  });
  test("200: Each object slug and description properties should contain expected values and not be empty", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then( ( {body} ) => {
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string")
          expect(topic.slug.trim().length).toBeGreaterThan(0)
          expect(typeof topic.description).toBe("string")
          expect(topic.description.trim().length).toBeGreaterThan(0)
        })
      });
  });
});

describe("GET /api/articles/:articleid", () => {
  test("200: Responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.article)).toBe(true)
        expect(body.article).toHaveLength(1)
        expect(body.article[0]).toBeInstanceOf(Object)
        expect(body.article[0]).toHaveProperty("author")
        expect(body.article[0]).toHaveProperty("title")
        expect(body.article[0]).toHaveProperty("article_id")
        expect(body.article[0]).toHaveProperty("body")
        expect(body.article[0]).toHaveProperty("topic")
        expect(body.article[0]).toHaveProperty("created_at")
        expect(body.article[0]).toHaveProperty("votes")
        expect(body.article[0]).toHaveProperty("article_img_url")
      });
  });
  test("200: Responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.article)).toBe(true)
        expect(body.article).toHaveLength(1)
        const article = body.article[0]
        expect(article).toMatchObject( {
          author: 'icellusedkars',
          title: 'A',
          article_id: 6,
          body: 'Delicious tin of cat food',
          topic: 'mitch',
          created_at: '2020-10-18T01:00:00.000Z',
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }
        )
      });
  });
  test("404: responds with not found when valid request but article id does not exist in the table", () => {
    return request(app)
      .get("/api/articles/25")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("No article found at Article ID: 25!")
      });
  });
  test("400: responds with bad request (psql error) when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/chicken")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!")
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should return an array of article objects with properties: author, title, article_id, topic, created_at, votes, article_img_url and comment_count - this is the total count of comments referencing this article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then( ( {body} ) => {
        console.log(body.articles, "THIS IS BODY.ARTICLES IN THE TEST")
        expect(Array.isArray(body.articles)).toBe(true)
        expect(body.articles).toHaveLength(13)
        expect(body.articles).toBeSortedBy("created_at", {descending: true})
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes")
          expect(article).toHaveProperty("article_img_url")
          expect(article).toHaveProperty("comment_count")
          expect(typeof article.comment_count).toBe("number") 
          expect(article.comment_count).toBeGreaterThanOrEqual(0)           
        })
      });
  });
});

describe(" GET /api/articles/:article_id/comments ", () => {
  test("200: should return an array of all comments (as objects) for a given article selected by that article's id. Each comment object should have property of comment_id, votes, created_at, author, body and article_id. Comments should be ordered in the array by most recent first.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then( ( {body} ) => {
        expect(Array.isArray(body.comments)).toBe(true)
        expect(body.comments).toHaveLength(11)  // we know article 1 has 11 comments
        expect(body.comments).toBeSortedBy("created_at", {descending: true})
        body.comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id")
          expect(comment).toHaveProperty("votes")
          expect(comment).toHaveProperty("created_at")
          expect(comment).toHaveProperty("author")
          expect(comment).toHaveProperty("body")
          expect(comment).toHaveProperty("article_id")
          });      
        });
      });

      test(" 404: should return an error message when passed an article_id which does not have any comments ", () => {
        return request(app)
          .get("/api/articles/4/comments") //we know article 4 does not have any comments 
          .expect(404)
          .then(( {body}) => {
            expect(body.msg).toBe("No comments found for Article: 4, try writing one :)")
          });
      });

      test(" 400: should return a psql error message when passed an article_id which is not valid ", () => {
        return request(app)
          .get("/api/articles/chicken/comments") 
          .expect(400)
          .then(( {body}) => {
            expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!")
          });
  })
})