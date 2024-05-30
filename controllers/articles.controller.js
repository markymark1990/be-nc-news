const {fetchArticles, fetchArticleById} = require("../models/articles.model.js");


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



