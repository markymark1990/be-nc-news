// const { promises } = require("supertest/lib/test.js")
const db = require("../db/connection.js")

exports.fetchUsers = () => {
    return db.query(
        'SELECT * FROM users;'
    ).then((res) => {
        return res.rows
    })
}
