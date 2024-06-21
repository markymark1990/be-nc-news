const {fetchArticles, fetchArticleById, updateArticleById} = require("../models/articles.model.js");


exports.getArticles = (req, res, next) => {
    const {properties, sort_by, order, topic} = req.query

     // Validate sort_by and set default if not provided
     const validSortColumns = ['created_at', 'votes', 'comment_count'];
     const sortBy = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
 
     // Validate order and set default if not provided
     const validOrders = ['asc', 'desc'];
     const orderBy = validOrders.includes(order) ? order.toUpperCase() : 'DESC';

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



