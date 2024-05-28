const request = require ('supertest');
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const app = require("../app.js")

beforeEach(() => {
    return seed(testData);
  });

afterAll(() => db.end());

describe("GET /api/topics", () => {
    it("200: Responds with all topics", () => {
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


