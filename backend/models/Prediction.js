const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  anxiety: { type: Number, required: true },
  depression: { type: Number, required: true },
  stress: { type: Number, required: true },

  // 🔥 added missing fields
  sleep_hours: { type: Number, required: true },
  study_hours: { type: Number, required: true },
  social_support: { type: Number, required: true },

  burnout_score: Number,
  student_cluster: Number,
  academic_prediction: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Prediction", PredictionSchema);