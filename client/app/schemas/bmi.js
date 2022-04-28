const mongoose = require("mongoose");
const BMI = mongoose.model(
  "BMI",
  new mongoose.Schema({
    weight: String,
    height: String,
    bmi_value: String,
    bmi_status: String,
    
    user_id : 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    
  },
  {
    timestamps: true
  }
  )
)
module.exports = BMI