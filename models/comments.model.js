const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")

exports.fetchCommentsByArticleId = (article_id) => {

    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    return db.query(
        `SELECT *
         FROM comments
         WHERE article_id = $1
         ORDER BY created_at DESC`, [article_id]
    ).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return res.rows
    })
}

exports.fetchPostCommentToArticle = (article_id, username, body) => {

    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" })
    }

    return db.query(
        `SELECT *
         FROM articles
         WHERE article_id = $1`, [article_id]
    ).then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        }
        return db.query(
            `INSERT INTO comments (article_id, author, body) 
         VALUES ($1, $2, $3)
         RETURNING *`, [article_id, username, body]
        ).then((res) => {
            return res.rows[0]
        })
    })
}