const {fetchArticles, fetchArticleById, updateArticleById} = require("../models/articles.model.js");


exports.getArticles = (req, res, next) => {
    const {properties, sortBy, orderBy, topic} = req.query
    fetchArticles(properties, sortBy, orderBy, topic)
        .then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next);
};


exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    fetchArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
};


exports.patchArticleById = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes: newVote} = req.body
    updateArticleById(article_id, newVote)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}



