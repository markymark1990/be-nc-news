const express = require('express');
const {getTopics, getEndpoints} = require("./controllers/topics.controller.js");
const app = express();

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.all('*', (req, res, next) => {
    res.status(404).send({msg: "Not Found"})
    })

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal Server Error' });
    });

module.exports = app