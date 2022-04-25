var express = require('express')
var router = express.Router()


/* GET Login page. */
//render to login page
router.get('/login', function(req, res, next) {
        res.render('login')
})
module.exports = router