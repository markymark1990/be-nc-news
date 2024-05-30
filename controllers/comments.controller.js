const { fetchCommentsByArticleId, addCommentToArticle, removeCommentById } = require("../models/comments.model.js");

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
    addCommentToArticle(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    removeCommentById(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch(next)
};