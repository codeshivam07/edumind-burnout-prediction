const express = require("express");
const router = express.Router();

const { predict, getUserPredictions } = require("../controllers/predictionController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, predict);

router.get("/history", authMiddleware, getUserPredictions);

module.exports = router;