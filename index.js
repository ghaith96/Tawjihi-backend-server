const express = require("express")
const app = express()
const morgan = require('morgan')
const compression = require("compression")
const bodyParser = require("body-parser")
const config = (process.env.NODE_ENV || 'dev') === 'dev' ? require('./config').dev : require('./config').production

app.set("json spaces", config.JSON_SPACES)

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use(require('./src/routes'))
app.use((req, res) => res.status(418).send("what am i doing here?"))

app.listen(config.PORT, () => console.log("woop woop!"))
