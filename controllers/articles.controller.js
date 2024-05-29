const {fetchArticles, fetchArticleById, fetchCommentsByArticleId} = require("../models/articles.model.js");


exports.getArticles = (req, res, next) => {
    const {properties, sortBy, orderBy} = req.query
    fetchArticles(properties, sortBy, orderBy)
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


exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    fetchCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}