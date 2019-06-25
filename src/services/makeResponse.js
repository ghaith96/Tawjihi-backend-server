const ok = (response, data) => {
    setJsonHeader(response)
    response.status(200).json(data)
}
const badRequest = (response, err) => {
    setJsonHeader(response)
    response.status(400).send({ error: err })
}

const setJsonHeader = (response) => response.setHeader("Content-Type", "application/json")

module.exports = {
    ok,
    badRequest
}