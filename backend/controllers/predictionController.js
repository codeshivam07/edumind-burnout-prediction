const { getPrediction } = require("../services/mlService");
const Prediction = require("../models/Prediction");

exports.predict = async (req, res) => {
    try {

        const data = req.body;

        // Call FastAPI ML API
        const prediction = await getPrediction(data);

        // Save prediction to MongoDB
        const savedPrediction = new Prediction({
            ...data,
            burnout_score: prediction.burnout_score,
            student_cluster: prediction.student_cluster,
            academic_prediction: prediction.academic_prediction
        });

        await savedPrediction.save();

        res.json({
            message: "Prediction generated successfully",
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