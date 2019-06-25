var router = require('express').Router()
var { database, makeResponse } = require('../../services')
var { requiredBody } = require('../../middleware')

router.post('/', requiredBody, async (req, res) => {
    let params = constructConditions(req.body)
    try {
        let query = 'SELECT * FROM master WHERE master MATCH ?;'
        let rows = await database.all(query, params)
        makeResponse.ok(res, rows)
    } catch (e) {
        console.log(e)
    }
})

const constructConditions = (body) => {
    query = Object.keys(body)
        .filter(key => body[key].length > 0)
        .map(key => ` (${key}: ${joinElements(body[key])}) `)
    return query.join(' AND ')
}

const joinElements = (data) => (data instanceof Array) ? data.join(' OR ') : data

module.exports = router