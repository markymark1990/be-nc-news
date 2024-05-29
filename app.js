const express = require('express');
const {getEndpoints} = require("./controllers/endpoints.controller.js");
const {getTopics} = require("./controllers/topics.controller.js");
const {getArticleById, getArticles, getCommentsByArticleId} = require("./controllers/articles.controller.js");
const app = express();

//Endpoints

app.get("/api", getEndpoints);

//Topics

app.get("/api/topics", getTopics);

//Articles

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

//Error Handling

app.all('*', (req, res, next) => {
    res.status(404).send({msg: "Not Found"})
    })

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({msg: err.msg})
    } else {
    res.status(500).send({ msg: 'Internal Server Error' });
    }
    });

module.exports = app