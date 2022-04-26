const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../schemas/")
const User = db.user

//go to login page
router.get('/login', function(req, res, next) {
        res.render('login')
})

//log in api
router.post('/login', (req, res) => {
    User.findOne({
      // email: req.body.email})
      $or: [{
        email: req.body.email
      }, {
        username: req.body.username
      }]
      }).then(user => {
      if (!user) {
        return res.render('login', {
          message: "Email or username does not exist."
        })
      } else {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
            if (err) {
              throw err
            }else {
              res.cookie("token", token)
              res.render('bmicalculator', {
                message: "User logged in successfully!"})
            }
          })
        } else {
          return res.render('login', {
            message: "Password is incorrect!"
          })
        }
      }
    })
    .catch(err => {
      console.log(err)
    })
  })


module.exports = router