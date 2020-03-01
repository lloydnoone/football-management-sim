require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const router = require('./config/router')
const logger = require('./lib/logger')
const errorHandler = require('./lib/errorHandler')
const { dbURI, port } = require('./config/environment')
const path = require('path')

//connect to db
mongoose.connect(
  dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
  () => console.log('connected to DB')
)

app.use(express.static(`${__dirname}/../client/dist`))

app.use(bodyParser.json())

app.use(logger)

app.use('/api', router)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'dist', 'index.html'))
})

app.use(errorHandler)

app.listen(port, () => console.log(`server listening on port ${port}`))

module.exports = app