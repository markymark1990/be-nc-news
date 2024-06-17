const express = require('express');
const { getEndpoints } = require("./controllers/endpoints.controller.js");
const { getTopics } = require("./controllers/topics.controller.js");
const { getArticles , getArticleById, patchArticleById } = require("./controllers/articles.controller.js");
const { getCommentsByArticleId, postCommentToArticle, deleteCommentById} = require("./controllers/comments.controller.js");
const { getUsers } = require("./controllers/users.controller.js")
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

//Endpoints

app.get("/api", getEndpoints);

//Topics

app.get("/api/topics", getTopics);

//Articles

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById)

//Comments

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

app.delete("/api/comments/:comment_id", deleteCommentById)

//Users

app.get("/api/users", getUsers);

//Error Handling

app.all('*', (req, res, next) => {
    res.status(404).send({ msg: "Not Found" })
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        res.status(500).send({ msg: 'Internal Server Error' });
    }
});

module.exports = app