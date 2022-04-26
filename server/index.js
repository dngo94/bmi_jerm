const path = require("path")
require("dotenv").config({path: path.resolve(__dirname, '../client/app/config/config.env')})
const express = require("express")
const cors = require("cors")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const {engine} = require("express-handlebars")
const index = require("../client/app/routes/route.index")
const login = require("../client/app/routes/route.login")
const signup = require("../client/app/routes/route.signup")
const createbmi = require("../client/app/routes/route.createbmi")


var corsOptions = {
    origin: "http://localhost:3000"}

app.use(cors(corsOptions))
app.use(express.json())
//to support url-encoded bodies
app.use(express.urlencoded({ extended: true }))
//parse cookies from the http
app.use(cookieParser())
app.use(bodyParser.json({extended:true}))

//set handlebars 
app.set('views', path.join(__dirname, '../client/app/views'))
app.engine("hbs", engine({layoutsDir: path.join(__dirname, "../client/app/views/layouts/"), extname: 'hbs'}))
app.set("view engine", "hbs")

// function to locate css files
//app.set('public', path.join(__dirname, '../client/app/public'))
app.use(express.static(path.join(__dirname,'../client/app/public')))

app.use('/', index)
app.use('/', login)
app.use('/', signup)
app.use('/', createbmi)

app.get("/", (req, res) => {
  res.json({ message:"Welcome to BMI server."})
})


const db = require("../client/app/schemas/")
const { config } = require("process")
const User = db.user  // User is the model name
const BMI = db.bmi


db.mongoose
  .connect(`mongodb://localhost:27017/healthtracker`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.")
  })
  .catch(err => {
    console.error("Connection error", err)
    process.exit()
  })


  app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
  })

  app.get("/user", (req, res) => { 
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


  //get all BMI records for a user
  app.get("/api/getbmi", (req, res) => {
    //const payload = jwt.verify(req.cookies.token, secret)
    const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

    BMI.where({user_id: payload.user._id})
      .find((err,bmis) => {
        res.json(bmis)
        console.log(bmis)
      })
  })


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`)
})