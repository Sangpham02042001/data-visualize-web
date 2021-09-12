const express = require('express')
const cors = require('cors')
require('dotenv').config()

const uploadRoutes = require('./routes/upload.route')
const scrollRoutes = require('./routes/scroll.route')

const app = express()
const HOST = process.env.HOST || 'http://localhost'
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use('/', uploadRoutes)
app.use('/', scrollRoutes)

app.listen(PORT, HOST, () => {
  console.log(`Server is running at ${HOST}:${PORT}`)
})