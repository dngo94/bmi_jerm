const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")


router.post('/logout', (req, res) => {
    res.cookie('token', '').send();
  })

module.exports = router