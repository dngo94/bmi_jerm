const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const {engine} = require("express-handlebars")
const routes = require("../client/app/routes/route.index")

const secret = "bmi-calculator-secret-key"

var corsOptions = {
    origin: "http://localhost:3000"}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json({extended:true}))

//set handlebars 
app.set("view engine", "hbs")
app.set('views', path.join(__dirname, '../client/app/views'))
app.engine("hbs", engine({layoutsDir: path.join(__dirname, "../client/app/views"), extname: 'hbs'}))


app.use('/', routes)

app.get("/", (req, res) => {
res.json({ message:"Welcome to BMI server."})
})


const db = require("../client/app/schemas/")
const { mongoose } = require("../client/app/schemas/")
const { dirname } = require("path")
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


//create a sign up api with hashed password and use jwt to create a token
app.post("/api/signup", (req, res) => {
  User.find({
    //$or:[ {'email': req.body.email}, {'username': req.body.username}]
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        message: "User already exists"
      })
    } else {
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
          jwt.sign({user}, secret, (err, token) => {
            if (err) {
              throw err
            }else {
              res.cookie("token", token)
            }
          //res.json({ message: "User registered successfully!" })
          res.sendFile(path.join(__dirname, '../client/app/views/login.html'))
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  })
})


  app.post("/api/login", (req, res) => {
    User.findOne({
      username: req.body.username
    }).then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        })
      }
      bcrypt.compare(req.body.password, user.password).then(isMatch => {
        if (isMatch) {
          jwt.sign({user}, secret, (err, token) => {
            if (err) {
              throw err
            }else {
              res.cookie("token", token)
            }
          })
        } else {
          return res.status(400).json({
            message: "Incorrect password"
          })
        }
      })
     //res.json({ message: "User logged in successfully!" })
     res.sendFile(path.join(__dirname, '../client/app/views/bmicalculator.html'))
    })
  })

  app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
  })

  app.get("/user", (req, res) => { 
    if (!req.cookies.token) {
      return res.json({})
    }
    const payload = jwt.verify(req.cookies.token, secret)

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


  //create a new BMI record for a user
  app.post("/api/createbmi", (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret)
    console.log(payload)

    function bmi_cal(weight, height) {
      var bmi = weight / (height * height)
      return bmi
    }

    function bmi_status(bmi) {
      if (bmi < 18.5) {
        return "Underweight"
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        return "Normal"
      } else if (bmi >= 25 && bmi <= 29.9) {
        return "Overweight"
      } else {
        return "Obese"
      }
    }

    const newBMI = new BMI({
      weight: req.body.weight,
      height: req.body.height,
      bmi_value: bmi_cal(req.body.weight, req.body.height),
      bmi_status: bmi_status(bmi_cal(req.body.weight, req.body.height)),
      user_id : payload.user._id
    })
    newBMI
      .save()
      .then(bmi => {
        res.json({ message: "BMI record created successfully!" })
      })
      .catch(err => {
        console.log(err)
      })
  })


  //get all BMI records for a user
  app.get("/api/getbmi", (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret)
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