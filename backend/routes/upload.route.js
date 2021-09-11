const express = require('express')
const { upload } = require('../controllers/upload.controller')

const router = express.Router()

router.route('/api/upload')
  .post(upload)

module.exports = router