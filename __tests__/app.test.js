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
  test("slug and description properties should contain expected values and not be empty", () => {
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
        console.log(body)
        expect(body.msg).toBe("Article not found!")
      });
  });
  test("400: responds with bad request (psql error) when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/chicken")
      .expect(400)
      .then(({body}) => {
        console.log(body)
        expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!")
      });
  });
});

