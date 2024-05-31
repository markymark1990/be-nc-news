const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")


exports.fetchArticles = (properties = 'author,title,article_id,topic,created_at,votes,article_img_url', sortBy = 'created_at', orderBy = 'DESC', topic) => {

    let queryStr = `
     SELECT ${properties},
    (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count
     FROM articles`

     const queryVals = []

     if (topic) {
        queryStr += ` WHERE topic = $1`
        queryVals.push(topic)
     }

     queryStr +=  ` ORDER BY ${sortBy} ${orderBy}`

     return db.query(queryStr, queryVals)
     .then((res) => {
        return res.rows
    })
}


exports.fetchArticleById = (article_id) => {
    if(isNaN(article_id)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    return db.query(
        `SELECT *,
        (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id) AS comment_count 
         FROM articles 
         WHERE article_id = $1`, [article_id]
    ).then((res) => { 
        if(res.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return res.rows[0]
    })
}


exports.updateArticleById = (article_id, newVote) => {
    if(isNaN(article_id) || isNaN(newVote)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    return db.query(
        `UPDATE articles 
         SET votes = votes + $2
         WHERE article_id = $1
         RETURNING *`, [article_id, newVote]
    ).then((res) => { 
        if(res.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return res.rows[0]
    })
}
