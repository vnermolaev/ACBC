// Leave nicely
const leave = (msg) => {
    console.error(msg)
    process.exit()
}

const { join } = require('path')

// Parse configuration
const dotenv = require('dotenv')
const result = dotenv.config({ path: join(__dirname, '..', '.env') })
if (result.error) {
    leave(result.error)
}

if (!('WEBSERVER_PORT' in process.env)) {
    leave('ERR:\tWEBSERVER_PORT must be specified in ".env"')
}

if (!('EXONUM_ADDRESS' in process.env)) {
    leave('ERR:\tEXONUM_ADDRESS must be specified in ".env"')
}

if (!('EXONUM_PORT' in process.env)) {
    leave('ERR:\tEXONUM_PORT must be specified in ".env"')
}

const express = require('express')
const bodyParser = require('body-parser')

// Initialize application
const app = express()

const port = process.env.WEBSERVER_PORT
const apiRoot = `http://${process.env.EXONUM_ADDRESS}:${process.env.EXONUM_PORT}`

app.set('apiRoot', apiRoot)

// Configure parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set path to static files
app.use(express.static(join(__dirname, '..', 'dist')))

// Activate routers
var api = require('./routes/api')
app.use('/api', api)

// Single Page Application entry point
app.get('/', function (req, res) {
    res.sendFile('index.html')
})

app.listen(port)

process.title = 'f2bc'

console.log(`App is served at http://localhost:${port}`)
