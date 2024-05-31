// const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")

exports.fetchTopics = () => {
    return db.query(
        'SELECT * FROM topics;'
    ).then((res) => {
        return res.rows
    })
}

