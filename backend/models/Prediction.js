const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  anxiety: Number,
  depression: Number,
  stress: Number,

  burnout_score: Number,
  student_cluster: Number,
  academic_prediction: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Prediction", PredictionSchema);