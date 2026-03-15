const axios = require("axios");

exports.getPrediction = async (data) => {

    const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        data
    );

    return response.data;
};