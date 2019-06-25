var sqlite3 = require('sqlite3').verbose()
const DB_PATH = require('../../config').dev.DB_PATH

const getDatabase = () => new sqlite3.Database(DB_PATH)

module.exports = {
    getDatabase
}