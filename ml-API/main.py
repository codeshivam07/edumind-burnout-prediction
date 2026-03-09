from fastapi import FastAPI
import joblib
import pandas as pd
import os

app = FastAPI(title="EduMind ML API")

# ===============================
# Get project root path
# ===============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_PATH = os.path.join(BASE_DIR, "models")

# ===============================
# Load models
# ===============================

burnout_model = joblib.load(os.path.join(MODELS_PATH, "model.pkl"))
burnout_features = joblib.load(os.path.join(MODELS_PATH, "feature_columns.pkl"))

cluster_model = joblib.load(os.path.join(MODELS_PATH, "student_cluster_model.pkl"))
cluster_scaler = joblib.load(os.path.join(MODELS_PATH, "cluster_scaler.pkl"))
cluster_features = joblib.load(os.path.join(MODELS_PATH, "cluster_features.pkl"))

academic_model = joblib.load(os.path.join(MODELS_PATH, "academic_model.pkl"))
academic_features = joblib.load(os.path.join(MODELS_PATH, "academic_feature_columns.pkl"))

print("Models loaded successfully")

# ===============================
# Home route
# ===============================

@app.get("/")
def home():
    return {"message": "EduMind ML API Running"}

# ===============================
# Prediction route
# ===============================

@app.post("/predict")
def predict(data: dict):

    # -------------------------
    # Burnout Prediction
    # -------------------------

    burnout_df = pd.DataFrame([data])

    for col in burnout_features:
        if col not in burnout_df:
            burnout_df[col] = 0

    burnout_df = burnout_df[burnout_features]

    burnout_pred = burnout_model.predict(burnout_df)[0]

    # -------------------------
    # Student Clustering
    # -------------------------

    cluster_df = pd.DataFrame([data])

    for col in cluster_features:
        if col not in cluster_df:
            cluster_df[col] = 0

    cluster_df = cluster_df[cluster_features]

    cluster_scaled = cluster_scaler.transform(cluster_df)

    cluster_pred = cluster_model.predict(cluster_scaled)[0]

    # -------------------------
    # Academic Prediction
    # -------------------------

    academic_df = pd.DataFrame([data])

    for col in academic_features:
        if col not in academic_df:
            academic_df[col] = 0

    academic_df = academic_df[academic_features]

    academic_pred = academic_model.predict(academic_df)[0]

    # -------------------------
    # Response
    # -------------------------

    return {
        "burnout_score": int(burnout_pred),
        "student_cluster": int(cluster_pred),
        "academic_prediction": float(academic_pred)
    }