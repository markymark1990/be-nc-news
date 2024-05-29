const {fetchTopics} = require("../models/topics.model.js");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res) => {
    res.status(200).send(endpoints)
}

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.status(200).send({topics});
    })
    .catch(next);
};