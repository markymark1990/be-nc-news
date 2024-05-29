const request = require('supertest');
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js")
const endpoints = require("../endpoints.json");

beforeEach(() => {
    return seed(testData);
});

afterAll(() => db.end());

describe("GET /api/topics", () => {
    it("200: responds with all topics", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                expect(Array.isArray(res.body.topics)).toBe(true);
                expect(res.body.topics.length).toBe(3);
                res.body.topics.forEach(topic => {
                    expect(topic).toHaveProperty('description');
                    expect(topic).toHaveProperty('slug');

                })
            })
    });
    it("404: Not Found when route does not exist", () => {
        return request(app)
            .get("/api/notARoute")
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe("Not Found");
            });
    });
});

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

describe("GET /api/articles/:article_id", () => {
    it("200: responds with an article object from its id", () => {
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
              })
            })
    })
    it("404: Not Found when article doesnt exist", () => {
        return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe("Not Found")
        })
    })
    it("400: Bad Request when id is invalid", () => {
        return request(app)
        .get("/api/articles/hello")
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe("Bad Request")
        })
    })

