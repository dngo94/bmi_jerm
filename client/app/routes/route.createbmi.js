const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const db = require("../schemas/")
const BMI = db.bmi

//create a new BMI record for a user
router.post("/createbmi", (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)

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
        res.render('bmicalculator', { 
          message: "BMI record created successfully!" })
      })
      .catch(err => {
        console.log(err)
      })
  })

  function bmi_cal(weight, height) {
    var bmi = weight / (height * height) * 10000
    //round to 2 decimal places
    return bmi.toFixed(2)
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


  module.exports = router