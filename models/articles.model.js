const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")

exports.fetchArticleById = (id) => {
    if(isNaN(id)) {
        return Promise.reject({status: 400, msg: "Bad Request"})
    }
    return db.query(
        "SELECT * FROM articles WHERE article_id = $1", [id]
    ).then((res) => { 
        if(res.rows.length === 0) {
            return Promise.reject({status: 404, msg: "Not Found"})
        }
        return res.rows[0]
    })
}