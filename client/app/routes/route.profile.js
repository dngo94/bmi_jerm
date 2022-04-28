const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../schemas/")
const User = db.user


router.get("/user", (req, res) => { 
    if (!req.cookies.token) {
      return res.json({})
    }
    //const payload = jwt.verify(req.cookies.token, secret)
    const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

    User.findById(payload.id)
    .then(user => {
      if(!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }
      return res.json(user)
    })
    .catch(err => {
      console.log(err)
    })
  })

module.exports = router