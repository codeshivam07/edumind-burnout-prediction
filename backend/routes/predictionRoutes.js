const express = require("express");
const router = express.Router();

const predictionController = require("../controllers/predictionController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("predict:", predictionController.predict);
console.log("history:", predictionController.getUserPredictions);
console.log("auth:", authMiddleware);

router.post("/", authMiddleware, predictionController.predict);
router.get("/history", authMiddleware, predictionController.getUserPredictions);

module.exports = router;