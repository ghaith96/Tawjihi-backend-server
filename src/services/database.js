var factory = require('./factory')

module.exports = {
    all: async (query, params = undefined) => new Promise((resolve, reject) => {
        try {
            var db = factory.getDatabase()
            db.all(query, params, (err, data) => err ? reject(err) : resolve(data))
        } catch (e) {
            reject(e)
        } finally {
            db.close()
        }
    }),

    executePreparedStatement: async (query, params = undefined) => new Promise((resolve, reject) => {
        try {
            var db = factory.getDatabase()
            var stmt = db.prepare(query)
            stmt.all(params, (err, data) => err ? reject(err) : resolve(data))
        } catch (e) {
            reject(e)
        } finally {
            stmt.finalize()
            db.close()
        }
    }),
}