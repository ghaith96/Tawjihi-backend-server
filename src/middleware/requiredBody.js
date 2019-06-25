var { badRequest } = require('../services/makeResponse')

module.exports = (req, res, next) => {
    let isEmpty = (Object.keys(req.body).length === 0 && req.body.constructor === Object)
    if (isEmpty) {
        badRequest(res, "can't fulfill empty request!")
    }
    else {
        next()
    }
}