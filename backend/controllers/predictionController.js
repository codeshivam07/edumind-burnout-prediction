const { getPrediction } = require("../services/mlService");
const Prediction = require("../models/Prediction");


// ================= PREDICT =================
exports.predict = async (req, res) => {
  try {
    const data = req.body;

    const prediction = await getPrediction(data);

    const savedPrediction = new Prediction({
      userId: req.user.id,

      anxiety: data.anxiety,
      depression: data.depression,
      stress: data.stress,

      // 🔥 added fields
      sleep_hours: data.sleep_hours,
      study_hours: data.study_hours,
      social_support: data.social_support,

      burnout_score: prediction.burnout_score,
      student_cluster: prediction.student_cluster,
      academic_prediction: prediction.academic_prediction
    });

    await savedPrediction.save();

    res.json({
      message: "Prediction saved successfully",
      prediction
    });

  } catch (error) {
    res.status(500).json({
      message: "Prediction failed",
      error: error.message
    });
  }
};


// ================= HISTORY =================
exports.getUserPredictions = async (req, res) => {
  try {

    const predictions = await Prediction.find({
      userId: req.user.id
    })
    .sort({ createdAt: -1 }); // 🔥 newest first

    res.json(predictions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch predictions"
    });
  }
};