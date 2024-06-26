const request = require('supertest');
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js")
const endpoints = require("../endpoints.json");
const articles = require('../db/data/test-data/articles.js');
jest.setTimeout(10000);

//Re-Seed

beforeEach(() => {
    return seed(testData);
});

afterAll(() => db.end());


//Endpoints

describe("GET /api", () => {
    it("200: responds with an object describing all the available endpoints on API", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual(endpoints)
            })
    })
})


//Topics

describe("GET /api/topics", () => {
    it("200: responds with all topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                expect(res.body.topics.length).toBe(3);
                res.body.topics.forEach(topic => {
                    expect(topic).toHaveProperty('description');
                    expect(topic).toHaveProperty('slug');

                })
            })
    });

});


//Articles

describe("GET /api/articles", () => {
    it("200: responds with all articles except for 'body', sorted by date in descending order by default, including addition of comment count", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(13);
                res.body.articles.forEach(article => {
                    expect(article).toHaveProperty('author');
                    expect(article).toHaveProperty('title');
                    expect(article).toHaveProperty('article_id');
                    expect(article).not.toHaveProperty('body');
                    expect(article).toHaveProperty('topic');
                    expect(article).toHaveProperty('created_at');
                    expect(article).toHaveProperty('votes');
                    expect(article).toHaveProperty('article_img_url');
                    expect(article).toHaveProperty('comment_count');
                })
                expect(res.body.articles).toBeSorted({ key: 'created_at', descending: true });
            })
    });
    it("200: responds with articles filtered by topic", () => {
        return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(12);
                res.body.articles.forEach(article => {
                    expect(article.topic).toBe('mitch');
                });
            });
    });
    it("404: Not Found when invalid topic is given", () => {
        return request(app)
            .get("/api/articles?topic=invalid")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
});

describe("GET /api/articles/:article_id", () => {
    it("200: responds with an article object from its id and includes comment_count", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then((res) => {
                expect(res.body.article).toHaveProperty("author")
                expect(res.body.article).toHaveProperty("title")
                expect(res.body.article).toHaveProperty("article_id")
                expect(res.body.article).toHaveProperty("body")
                expect(res.body.article).toHaveProperty("topic")
                expect(res.body.article).toHaveProperty("created_at")
                expect(res.body.article).toHaveProperty("votes")
                expect(res.body.article).toHaveProperty("article_img_url")
                expect(res.body.article).toHaveProperty("comment_count")
            });
    });
    it("404: Not Found when article doesnt exist", () => {
        return request(app)
            .get("/api/articles/9999")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
    it("400: Bad Request when id is invalid", () => {
        return request(app)
            .get("/api/articles/invalid_article_id")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });
});

describe("GET /api/articles sorting", () => {
    it("200: responds with articles sorted by created_at in descending order by default", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(13);
                expect(res.body.articles).toBeSorted({ key: 'created_at', descending: true });
            });
    });

    it("200: responds with articles sorted by votes in ascending order", () => {
        return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(13);
                expect(res.body.articles).toBeSorted({ key: 'votes', descending: false });
            });
    });

    it("200: responds with articles sorted by created_at in ascending order", () => {
        return request(app)
            .get("/api/articles?sort_by=created_at&order=asc")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(13);
                expect(res.body.articles).toBeSorted({ key: 'created_at', descending: false });
            });
    });

    it("200: responds with articles sorted by votes in descending order", () => {
        return request(app)
            .get("/api/articles?sort_by=votes&order=desc")
            .expect(200)
            .then((res) => {
                expect(res.body.articles.length).toBe(13);
                expect(res.body.articles).toBeSorted({ key: 'votes', descending: true });
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    it("200: responds with an updated article with increased votes value as specified", () => {
        const addVote = { inc_votes: 5 }
        return db.query(
            `SELECT votes
             FROM articles
             WHERE article_id = 1`
        ).then((result) => {
            const updatedVotes = result.rows[0].votes + 5
            return request(app)
                .patch("/api/articles/1")
                .send(addVote)
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toHaveProperty("article_id", 1)
                    expect(res.body.article).toHaveProperty("votes", updatedVotes)
                });
        })
    });
    it("200: responds with an updated article with decreased votes value as specified", () => {
        const addVote = { inc_votes: -5 }
        return db.query(
            `SELECT votes
             FROM articles
             WHERE article_id = 1`
        ).then((result) => {
            const updatedVotes = result.rows[0].votes - 5
            return request(app)
                .patch("/api/articles/1")
                .send(addVote)
                .expect(200)
                .then((res) => {
                    expect(res.body.article).toHaveProperty("article_id")
                    expect(res.body.article).toHaveProperty("votes", updatedVotes)
                });
        })
    });
    it("400: Bad Request when inc_votes is missing", () => {
        return request(app)
            .patch("/api/articles/1")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });
    it("404: Not Found when article doesnt exist", () => {
        const addVote = { inc_votes: 5 }
        return request(app)
            .patch("/api/articles/9999")
            .send(addVote)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
    it("400: Bad Request when id is invalid", () => {
        const addVote = { inc_votes: 5 }
        return request(app)
            .patch("/api/articles/invalid_article_id")
            .send(addVote)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });
});


//Comments

describe("GET /api/articles/:article_id/comments", () => {
    it("200: responds with an array of comments for a given article_id", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((res) => {
                expect (res.body.comments.length).toBeGreaterThan(1)
                res.body.comments.forEach(comment => {
                    expect(comment).toHaveProperty("comment_id")
                    expect(comment).toHaveProperty("body")
                    expect(comment).toHaveProperty("author")
                    expect(comment).toHaveProperty("votes")
                    expect(comment).toHaveProperty("created_at")
                });
            });
    });
    it("200: responds with an array of comments for a given article_id in date order, most recent first", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then((res) => {
                expect(res.body.comments).toBeSorted({ key: 'created_at', descending: true })
            });
    });
    it("404: Not Found when article doesnt exist", () => {
        return request(app)
            .get("/api/articles/9999/comments")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
    it("400: Bad Request when id is invalid", () => {
        return request(app)
            .get("/api/articles/invalid_article_id/comments")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });

});

describe("POST /api/articles/:article_id/comments", () => {
    it("201: responds with comment added to article", () => {
        const comment = {
            username: "butter_bridge",
            body: "Nice article"
        }
        return request(app)
            .post("/api/articles/1/comments")
            .send(comment)
            .expect(201)
            .then((res) => {
                expect(res.body.comment).toHaveProperty("comment_id")
                expect(res.body.comment).toHaveProperty("body", "Nice article")
                expect(res.body.comment).toHaveProperty("article_id", 1)
                expect(res.body.comment).toHaveProperty("author", "butter_bridge")
                expect(res.body.comment).toHaveProperty("votes")
                expect(res.body.comment).toHaveProperty("created_at")
            });
    });
    it("400: Bad Request when property missing", () => {
        const comment = {
            username: "butter_bridge",
            body: ""
        }
        return request(app)
            .post("/api/articles/1/comments")
            .send(comment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });
    it("400: Bad Request when id is invalid", () => {
        const comment = {
            username: "butter_bridge",
            body: "Nice article"
        }
        return request(app)
            .post("/api/articles/invalid_article_id/comments")
            .send(comment)
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            });
    });
    it("404: Not Found when article doesnt exist", () => {
        const comment = {
            username: "butter_bridge",
            body: "Nice article"
        }
        return request(app)
            .post("/api/articles/9999/comments")
            .send(comment)
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
})


describe("DELETE /api/comments/:comment_id/", () => {
    it("204: deletes comment and responds with no content", () => {
        return request(app)
            .delete("/api/comments/1")
            .expect(204)
    });
    it("400: Bad Request when id is invalid", () => {
        return request(app)
            .delete("/api/comments/invalid_comment_id")
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe("Bad Request")
            })
    });
    it("404: Not Found when article doesnt exist", () => {
        return request(app)
            .delete("/api/comments/9999")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found")
            });
    });
})


//Users

describe("GET /api/users", () => {
    it("200: responds with all users", () => {
        return request(app)
            .get("/api/users")
            .expect(200)
            .then((res) => {
                expect(res.body.users.length).toBe(4);
                res.body.users.forEach(user => {
                    expect(user).toHaveProperty('username');
                    expect(user).toHaveProperty('name');
                    expect(user).toHaveProperty('avatar_url');
                })
            })
    });
    
});

//General Errors

describe("/invalid endpoint", () => {
    it("404: Not Found when route does not exist", () => {
        return request(app)
            .get("/api/notARoute")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found");
            });
    });
})




