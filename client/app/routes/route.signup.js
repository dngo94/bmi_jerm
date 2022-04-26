const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const db = require("../schemas/")
const User = db.user


//go to signup page
router.get('/signup', function(req, res, next) {
    res.render('signup')
})

//a sign up api with hashed password and use jwt to create a token
router.post('/signup', (req, res) => {
    User.findOne({
      // email: req.body.email})
      $or: [{
        email: req.body.email
      }, {
        username: req.body.username
      }]
      }).then(user => {
      if (user) {
        return res.render('signup', {
          message: "Email or username already exists."
        })
      } else {
        if (req.body.password !== req.body.confirmPassword) {
          return res.render('signup', {
            message: "Passwords do not match."
          })
        }
        const hashedPassword = bcrypt.hashSync(req.body.password, 8)
        const newUser = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          dob: req.body.dob
        })
        newUser
          .save()
          .then(user => {
            jwt.sign({user}, process.env.JWT_SECRET, (err, token) => {
              if (err) {
                throw err
              }else {
                res.cookie("token", token)
              }
            //res.json({ message: "User registered successfully!" })
            res.render('login', {
              message: "User registered successfully!"})
            })
          })
          .catch(err => {
            console.log(err)
          })
        }
      })
  })
  
  module.exports = router