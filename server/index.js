//Modules
const path = require("path")
require("dotenv").config({path: path.resolve(__dirname, '../client/app/config/config.env')})
const express = require("express")
const cors = require("cors")
const app = express()
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//Handlebars
const {engine} = require("express-handlebars")
const index = require("../client/app/routes/route.index")
const login = require("../client/app/routes/route.login")
const signup = require("../client/app/routes/route.signup")
const createbmi = require("../client/app/routes/route.createbmi")
const getbmi = require("../client/app/routes/route.getbmi")
const profile = require("../client/app/routes/route.profile")
const logout = require("../client/app/routes/route.logout")


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
app.use('/', getbmi)
app.use('/', profile)
app.use('/', logout)

//Connect to MongoDB
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


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}.`)
})