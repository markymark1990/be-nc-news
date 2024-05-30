const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")


exports.fetchArticles = (properties = '*', sortBy = 'created_at', orderBy = 'DESC') => {
    return db.query(
        `SELECT ${properties},
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
         FROM articles  
         ORDER BY ${sortBy} ${orderBy}`
    ).then((res) => {
        return res.rows
    })
}


exports.fetchArticleById = (article_id) => {
    if(isNaN(article_id)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    return db.query(
        `SELECT * 
         FROM articles 
         WHERE article_id = $1`, [article_id]
    ).then((res) => { 
        if(res.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return res.rows[0]
    })
}
