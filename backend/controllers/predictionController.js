const { getPrediction } = require("../services/mlService");
const Prediction = require("../models/Prediction");

exports.predict = async (req, res) => {
  try {
    const data = req.body;

   
    const prediction = await getPrediction(data);

   
    const savedPrediction = new Prediction({
      userId: req.user.id,   

      anxiety: data.anxiety,
      depression: data.depression,
      stress: data.stress,

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
    console.error("Prediction Error:", error);

    res.status(500).json({
      message: "Prediction failed",
      error: error.message
    });
  }
};



exports.getUserPredictions = async (req, res) => {
  try {

    const predictions = await Prediction.find({
      userId: req.user.id   
    }).sort({ createdAt: 1 });  
    res.json(predictions);

  } catch (error) {
    console.error("History Fetch Error:", error);

    res.status(500).json({
      message: "Failed to fetch predictions",
      error: error.message
    });
  }
};