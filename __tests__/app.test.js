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
      .get("/api/articles/25")  //we know article 25 is valid but does not exist
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

describe("GET /api/articles/:article_id/comments ", () => {
  test("200: should return an array of all comments (as objects) for a given article selected by that article's id. Each comment object should have property of comment_id, votes, created_at, author, body and article_id. Comments should be ordered in the array by most recent first.", () => {
    return request(app)
      .get("/api/articles/1/comments")   //we know article 1 has 11 comments
      .expect(200)
      .then( ( {body} ) => {
        expect(Array.isArray(body.comments)).toBe(true)
        expect(body.comments).toHaveLength(11)  
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

  test("200: should return 200 when passed an article_id which exists but does not have any comments", () => {
      return request(app)
        .get("/api/articles/4/comments") //we know article 4 exists but does not have any comments 
        .expect(200)
        .then(( {body}) => {
          expect(body.msg).toBe("Article ID 4 has no comments!")
      });
  });

  test("404: should return an error message when passed a valid article_id which does not exist", () => {
        return request(app)
          .get("/api/articles/9999/comments") //we know article 9999 is valid but does not exist
          .expect(404)
          .then(( {body}) => {
            expect(body.msg).toBe("Cannot find Article: 9999!")
          });
      });

  test("400: should return a psql error message when passed an article_id which is not valid ", () => {
        return request(app)
          .get("/api/articles/chicken/comments") //we know this is not a valid article_id
          .expect(400)
          .then(( {body}) => {
            expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!")
          });
    });
});

describe("POST /api/articles/:article_id/comments ", () => {
  test("201: Responds with the posted comment when posting comment to an article selected by an article_id", () => {
    return request(app)
      .post("/api/articles/2/comments") //we know this article_id does not have any comments yet 
      .send({username: "butter_bridge", body: "THIS IS A TEST COMMENT!"})
      .expect(201)
      .then( ( {body} ) => {
        expect(body).toEqual( { comment: 'THIS IS A TEST COMMENT!' } )
      })
  });

  test("400: Responds with username not valid when posting with username which does not exist in users", () => {
    return request(app)
      .post("/api/articles/2/comments") 
      .send({username: "tom-joy", body: "THIS IS A TEST COMMENT!"})   //invalid username 
      .expect(400)
      .then( ( {body} ) => {
      expect(body.msg).toBe("Username invalid! Check you have entered username correctly or create new user account")
      })
  });

  test("400: Responds with msg of missing information when username is missing", () => {
    return request(app)
      .post("/api/articles/2/comments") 
      .send({username: "", body: "THIS IS A TEST COMMENT!"})  //missing username 
      .expect(400)
      .then( ( {body} ) => {
      expect(body.msg).toBe("Missing username or comment to post!")
      })
  });

  test("400: Responds with msg of missing information when body is missing", () => {
    return request(app)
      .post("/api/articles/2/comments")  
      .send({username: "butter_bridge", body: ""})  //missing comment to send 
      .expect(400)
      .then( ( {body} ) => {
      expect(body.msg).toBe("Missing username or comment to post!")
      })
  });

  test("404: Responds with msg when attempting to post comment to an article_id which does not exist", () => {
    return request(app)
      .post("/api/articles/99999/comments") //we know this article_id does not exist
      .send({username: "butter_bridge", body: "THIS IS A TEST COMMENT!"})
      .expect(404)
      .then( ( {body} ) => {
      expect(body.msg).toBe("Article ID not found!") //THIS COMES FROM THE GLOBAL PSQL ERR HANDLER AS ITS A 23503 ERROR 
      })
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: successfully adds votes when newVote is a positive integer", () => {
    return request(app)
    .patch("/api/articles/1") //article_id 1 has 100 votes to start off with 
    .send( { inc_votes: 10 } )
    .expect(200)
    .then(( { body } ) => {
      expect(body.article.votes).toBe(110) //10 votes should have been added on 
    })
  });  

  test("200: successfully reduces votes when newVote is a negative integer", () => {
    return request(app)
    .patch("/api/articles/1") //article_id 1 has 100 votes to start off with 
    .send( { inc_votes: -10 } )
    .expect(200)
    .then(( { body } ) => {
      expect(body.article.votes).toBe(90) //10 votes should have been taken away
    })
  }); 

  test("400: responds with error message when inc_votes is missing but article_id is valid", () => {
    return request(app)
    .patch("/api/articles/1") //article_id 1 is valid 
    .send( { } ) // inc_votes is missing 
    .expect(400)
    .then(( { body } ) => {
      expect(body.msg).toBe("Must include a valid article_ID and valid number to add")
    })
  }); 

  test("400: responds with psql error message when inc_votes is valid but article_id is invalid", () => {
    return request(app)
    .patch("/api/articles/chicken") //not a valid article_id
    .send( { inc_votes: 10 } ) // valid inc_votes
    .expect(400)
    .then(( { body } ) => {
      expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!") //PSQL error from global err handler 
    })
  }); 

  test("400: responds with psql error message when article_id is valid but inc_votes is NOT A NUMBER", () => {
    return request(app)
    .patch("/api/articles/1") //valid article_id
    .send( { inc_votes: "Not_a_Number" } ) // NOT A NUMBER
    .expect(400)
    .then(( { body } ) => {
      expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!") //PSQL error from global err handler 
    })
  }); 
}); 

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes comment by comment_id. Then returns 204 status and NO CONTENT", () => {
    return request(app)
    .delete("/api/comments/16")  // COMMENT_ID 16 is the ONLY comment on article 6 
    .expect(204)
    .then(( { body } ) => {
      expect(body).toEqual({})
    });
  });

  test("404: Try to delete a comment which does not exist returns appropriate error message", () => {
    return request(app)
    .delete("/api/comments/19") // This comment_id does not exist
    .expect(404)
    .then(( { body } ) => {
      expect(body.msg).toBe("Comment 19 did not exist or was already deleted!")
    });
  });

  test("400: Invalid comment_id should cause PSQL error - bad request ", () => {
    return request(app)
    .delete("/api/comments/chicken") // This is an invalid comment_id
    .expect(400)
    .then(( { body } ) => {
      expect(body.msg).toBe("BAD REQUEST - PSQL ERROR!")
    });
  });
});

describe("GET /api/users", () => {
  test("200: Returns an array of user objects. Each user object should contain username, name, avatar_url properties", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then(( { body } ) => {
      expect(Array.isArray(body.users)).toBe(true)
      expect(body.users.length).toBe(4)
      body.users.forEach((user) => {
        expect(user).toHaveProperty("username")
        expect(user).toHaveProperty("name")
        expect(user).toHaveProperty("avatar_url")
      });
    });
  }); 
});

