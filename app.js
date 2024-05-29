const express = require('express');
const {getEndpoints} = require("./controllers/endpoints.controller.js");
const {getTopics} = require("./controllers/topics.controller.js");
const {getArticleById} = require("./controllers/articles.controller.js");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

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