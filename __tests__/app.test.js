const endpointsJson = require("../endpoints.json");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data"); 
const request = require("supertest"); 
const app = require("../app.js"); 

beforeEach(() => {   
  return seed(data);   
});

afterAll(() => {  
  return db.end(); 
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
});

describe("GET /api/articles/:articleid", () => {
  test("200: Responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.articles)).toBe(true)
        expect(body.articles).toHaveLength(1)
        expect(body.articles[0]).toBeInstanceOf(Object)
        expect(body.articles[0]).toHaveProperty("author")
        expect(body.articles[0]).toHaveProperty("title")
        expect(body.articles[0]).toHaveProperty("article_id")
        expect(body.articles[0]).toHaveProperty("body")
        expect(body.articles[0]).toHaveProperty("topic")
        expect(body.articles[0]).toHaveProperty("created_at")
        expect(body.articles[0]).toHaveProperty("votes")
        expect(body.articles[0]).toHaveProperty("article_img_url")
      });
  });

  test.only("200: Responds with an article object with properties of author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/6")
      .expect(200)
      .then(({body}) => {
        console.log(body.article[0])
        console.log(body)
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
  })
});
