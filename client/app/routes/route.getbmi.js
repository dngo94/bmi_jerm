const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const db = require("../schemas/")
const BMI = db.bmi

//get all BMI records for a user and render to bmicalculator
router.get("/getbmi", (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.JWT_SECRET)
    BMI.where({"user_id": payload.user._id})
      .find({})
      .then(bmis => {
        //convert to array
        const bmiArray = bmis.map(bmi => {
          return {
            id: bmi._id,
            weight: bmi.weight,
            height: bmi.height,
            bmi_value: bmi.bmi_value,
            bmi_status: bmi.bmi_status,
            //trim date to only show month and year
            createdOn: bmi.createdAt.toISOString().slice(0, 10),
            //trim time to only show hour and minute
            createdAt: bmi.createdAt.toISOString().slice(11, 16)
          }
        })
        res.render("bmicalculator", {
          bmis: bmiArray,
          message: "BMI records retrieved successfully!"
        })
        //res.json(bmiArray)
      })
      .catch(err => {
        console.log(err)
      })
})


module.exports = router