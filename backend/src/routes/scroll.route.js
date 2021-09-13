const express = require('express')
const { scroll } = require('../controllers/scroll.controller')

const router = express.Router()

router.route('/api/scroll')
  .get(scroll)

module.exports = router