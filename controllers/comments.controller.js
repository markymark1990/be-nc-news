const { fetchCommentsByArticleId, fetchPostCommentToArticle } = require("../models/comments.model.js");

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    fetchCommentsByArticleId(article_id)
        .then((comments) => {
            res.status(200).send({ comments })
        })
        .catch(next)
};

exports.postCommentToArticle = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    fetchPostCommentToArticle(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}