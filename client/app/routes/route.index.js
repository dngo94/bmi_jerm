var express = require('express')
var router = express.Router()

//render home page
router.get('/', function(req, res, next) {
        res.render('home')
})
module.exports = router